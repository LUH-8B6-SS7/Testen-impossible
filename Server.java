import java.io.IOException;
import java.net.*;
import java.util.ArrayList;
import java.util.concurrent.TimeoutException;

public class Server extends Thread{
    public static volatile boolean running = true;

    ServerSocket server;
    ArrayList<Thread> clients = new ArrayList<Thread>();

    public Server() throws IOException{
        server = new ServerSocket(80);
        server.setSoTimeout(2000);
        if(Database.enableGeneralInfo) System.out.println("Server running on localhost:80");
    }

    @Override
    public void run(){
        Thread cleaner = new Thread(){
            @Override
            public void run(){
                while(running){
                    cleanDeadThreads();
                    try { sleep(1000); } catch (Exception e) { System.out.println("Thread cleaner sleep interrupted:\n" + e); }
                }
            }
        };
        cleaner.start();

        while(running){
            try{
                Socket client = server.accept();
                Thread t = new Client(client);
                t.start();
                clients.add(t);
            } catch (SocketTimeoutException e){
                //Expected for checking running status
            } catch (Exception e) {
                System.out.println("Client rejected:\n" + e);
            }
        }

        for(int i = 0; i < clients.size(); i++){
            try {
                clients.get(i).join();
                if(Database.enableDebugInfo) System.out.println("Client joined");
            } catch (Exception e) {
                System.out.println("Client join failed");
            }
        }

        try { server.close(); } catch (Exception e) { System.out.println("Server close failed:\n" + e); }
        try { cleaner.join(); } catch (Exception e) { System.out.println("Thread cleaner join failed:\n" + e); }
        if(Database.enableGeneralInfo) System.out.println("Server closed");
    }

    private synchronized void cleanDeadThreads(){
        for(int i = clients.size()-1; i >= 0; i--){
            if(!clients.get(i).isAlive()){
                String str = clients.remove(i).toString();
                if(Database.enableDebugInfo) System.out.println("\n" + str + " was cleared from memory");
            }
        }
    }
}
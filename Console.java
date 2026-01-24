import java.io.*;

public class Console extends Thread{

    public Console(){}
    
    @Override
    public void run(){
        if(Database.enableGeneralInfo) System.out.println("enter exit or q to shut down the server");

        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

            while (Server.running) { 
                String str = br.readLine().trim().toLowerCase();
                if(str.equals("exit") || str.equals("q")){ Server.running = false; }
            }

            br.close();
            if(Database.enableDebugInfo) System.out.println("Console closed");
        } catch (Exception e) {
            System.out.println("Console can't be read");
        }
    }
}
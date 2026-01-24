/*
Connection is droped after response to avoid waiting on abandoned connection
*/
import java.io.*;
import java.net.*;
import java.nio.file.NoSuchFileException;

public class Client extends Thread{
    @Override
    public void run(){
        if(Database.enableDebugInfo) System.out.println("new client on " + this);
        
        try {
            while (Server.running && socket.isConnected()) {
                InputStream stream = socket.getInputStream();
                String msg = "";
                while(stream.available() > 0){
                    msg += (char)stream.read();
                }

                if(msg.length() > 0){
                    //System.out.println("\n\n" + msg);

                    if(msg.contains("GET") && !msg.contains("api/")){
                        int start = msg.indexOf("GET") + 5;
                        int ende = msg.indexOf(' ', start);
                        String url = msg.substring(start, ende);

                        if(url.contains(".html")){
                            String[] tokens = url.split("\\?");
                            String[] param = new String[0];
                            if(tokens.length > 1) param = tokens[1].split("&");


                            if(Database.enableDebugInfo) System.out.println("\nRequested html on " + this + ":\nLength :" + url.length() + " Type: Get :: " + url);
                            
                            try {
                                send(new Message(Database.getComposedFile(tokens[0], param)));
                            } catch (NoSuchFileException e) {
                                send(new Message(404, "File not found"));
                            }
                        }
                        else{
                            if(Database.enableDebugInfo) System.out.println("\nRequested image on " + this + ":\nLength :" + url.length() + " Type: Get :: " + url);
                            try {
                                String fileType = url.substring(url.indexOf(".") + 1);
                                send(new Message("image/" + fileType, Database.readFile(url)));
                            } catch (NoSuchFileException e) {
                                send(new Message(404, "File not found"));
                            }
                        }
                    }
                    else if(msg.contains("api/")){
                        int start = msg.indexOf("api/") + 4;
                        int ende = msg.indexOf(' ', start);
                        String key = msg.substring(start, ende);
                        String body = msg.substring(msg.indexOf("\r\n\r\n") + 4);

                        if(Database.enableDebugInfo) System.out.println("\napi request:" + msg.substring(start-9, ende) + " " + body);

                        if(msg.contains("GET")){
                            try {
                                send(new Message(Database.get(key)));
                            } catch (Exception e) {
                                send(new Message(404, "Data not found"));
                            }
                            send(new Message(Database.get(key)));
                        }
                        if(msg.contains("PUT")){
                            Database.set(key, body);
                            send(new Message());
                        }
                        if(msg.contains("POST")){
                            Database.add(key, body);
                            send(new Message());
                        }
                        if(msg.contains("DELETE")){
                            Database.remove(key, body);
                            send(new Message());
                        }

                        break;
                    }
                    else{
                        if(Database.enableDebugInfo) System.out.println("\nNew Message on " + this + ":\nLength :" + msg.length() + " Type: other ::\n" + msg);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("\nClient " + this + " ran into a problem:\n" + e);
        }

        //Exit
        try {
			writer.close();
            socket.close();
        } catch (Exception e) {
            System.err.println("Client " + this + " had a problem on exit:\n" + e);
        }

        if(Database.enableDebugInfo) System.out.println("Client " + this + " closed");
    }

    

    Socket socket;

    DataOutputStream writer;

    public Client(Socket _socket) throws IOException{
        socket = _socket;

        writer = new DataOutputStream(
            new BufferedOutputStream(
                socket.getOutputStream()
            )
        );
    }

    private void send(Message msg) throws IOException{
        writer.write(msg.getBytes(), 0, msg.getBytes().length);
        writer.flush();
    }
}


/*
Content Types:

image/gif image/jpeg image/png image/tiff image/vnd.microsoft.icon image/x-icon image/vnd.djvu image/svg+xml

text/css text/csv text/html text/javascript (obsolete) text/plain text/xml
*/
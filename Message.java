import java.nio.charset.*;

public class Message{
    private static final Charset charset = StandardCharsets.UTF_8;
    int statusCode;
    String contentType;
    byte[] msg;

    public Message(){
        statusCode = 200;
        contentType = "text/html";
        msg = new byte[0];
    }

    public Message(byte[] _msg){
        statusCode = 200;
        contentType = "text/html";
        msg = _msg;
    }

    public Message(String _msg){
        statusCode = 200;
        contentType = "text/html";
        msg = _msg.getBytes();
    }

    public Message(String _contentType, byte[] _msg){
        statusCode = 200;
        contentType = _contentType;
        msg = _msg;
    }

    public Message(String _contentType, String _msg){
        statusCode = 200;
        contentType = _contentType;
        msg = _msg.getBytes();
    }

    public Message(int _statusCode, String _contentType, byte[] _msg){
        statusCode = _statusCode;
        contentType = _contentType;
        msg = _msg;
    }

    public Message(int _statusCode, String _contentType, String _msg){
        statusCode = _statusCode;
        contentType = _contentType;
        msg = _msg.getBytes();
    }

    public Message(int _statusCode, byte[] _msg){
        statusCode = _statusCode;
        contentType = "text/html";
        msg = _msg;
    }

    public Message(int _statusCode, String _msg){
        statusCode = _statusCode;
        contentType = "text/html";
        msg = _msg.getBytes();
    }

    public byte[] getBytes(){
        int contentLength = msg.length + "\r\n".getBytes().length;

        String str = "HTTP/1.1 " + statusCode + " OK\r\n" +
            "Content-Length: " + contentLength + "\r\n" +
            "Content-Type: " + contentType + "; charset=" + charset.displayName() + "\r\n" +
            "\r\n";// An empty line marks the end of the response's header
        
        byte[] ret = new byte[str.getBytes().length + msg.length + "\r\n".getBytes().length];

        int i = 0;
        for(int j = 0; j < str.getBytes().length; j++){
            ret[i] = str.getBytes()[j];
            i++;
        }
        for(int j = 0; j < msg.length; j++){
            ret[i] = msg[j];
            i++;
        }
        for(int j = 0; j < "\r\n".getBytes().length; j++){
            ret[i] = "\r\n".getBytes()[j];
            i++;
        }

        return ret;
    }
}
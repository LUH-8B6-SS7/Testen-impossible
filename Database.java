import java.io.*;
import java.nio.file.Files;
import java.util.Scanner;

//JSON-Lib for java: https://github.com/stleary/JSON-java
import org.json.JSONObject;
import org.json.JSONArray;

import netscape.javascript.JSObject;

public class Database {
    public static final boolean enableDebugInfo = true;
    public static final boolean enableGeneralInfo = true;

    public static void main(String[] args) throws Exception{
        json = new JSONObject(readTextFile("data.json"));
        if(Database.enableDebugInfo) System.out.println("Loaded data: " + json);
        
        Thread server = new Server();
        server.start();
        
        Thread console = new Console();
        console.start();


        try {
            server.join();
            console.join();
        } catch (Exception e) {
            System.out.println("Thread join failed:\n" + e);
        }

        writeFile("data.json", json.toString());
        if(Database.enableGeneralInfo) System.out.println("Bye");
    }


    private static JSONObject json;

    public static synchronized void set(String key, String value){
        json.put(key, value);
    }

    public static synchronized String get(String key){
        return json.get(key).toString();
    }

    public static synchronized void add(String key, String value){
        json.append(key, value);
    }

    public static synchronized void remove(String key, String value){
        JSONArray arr = json.getJSONArray(key);
        for(int i = 0; i < arr.length(); i++){
            if(arr.get(i).toString().equals(value)){
                arr.remove(i);
                break;
            }
        }
        json.put(key, arr);
    }



    public static byte[] readFile(String filename) throws FileNotFoundException, IOException{
        File file = new File("images/" + filename);
        return Files.readAllBytes(file.toPath());
    }

    public static String readTextFile(String filename) throws FileNotFoundException{
        String fileContent = "";
        
        File file = new File("data/" + filename);
        Scanner reader = new Scanner(file);
        while(reader.hasNextLine()){
            fileContent += reader.nextLine() + "\n";
        }
        reader.close();
        
        return fileContent;
    }

    public static void writeFile(String fileName, String fileContent) throws IOException{
        FileWriter writer = new FileWriter("data/" + fileName);
        writer.write(fileContent);
        writer.close();
    }

    public static String getComposedFile(String filename, String[] param) throws FileNotFoundException{  //param: JSON mit allen sachen aus der URL
        //space is ransmitted as %20
        for(int i = 0; i < param.length; i++){
            int index = param[i].indexOf("%20");
            while(index != -1){
                String firstHalf = param[i].substring(0, index);
                String lastHalf = param[i].substring(index+3);
                param[i] = firstHalf + " " + lastHalf;

                index = param[i].indexOf("%20");
            }
        }


        String composite = readTextFile(filename);

        String[] tokens = composite.split("§");
        String result = "";

        for(int i = 0; i < tokens.length; i++){
            if(tokens[i].equals("FILE")){
                i++;
                result += getComposedFile(tokens[i], param);
            }
            else if(tokens[i].equals("VALUE")){
                i++;
                try {
                    result += getParamValueOf(tokens[i], param);
                } catch (Exception e) {
                    //Default values
                    if(tokens[i].equals("role")) result += "Student";
                }
            }
            else{
                result += tokens[i];
            }
        }
        return result;
    }

    private static String getParamValueOf(String key, String[] param) throws Exception{
        for(String str : param){
            String[] tokens = str.split("=");
            if(tokens[0].equals(key) && tokens.length > 1) return tokens[1];
        }

        throw new Exception();
    }
}
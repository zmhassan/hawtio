/**
 * Copyright (C) 2013 the original author or authors.
 * See the notice.md file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.hawt.web.tool;

import io.hawt.sample.Main;
import io.hawt.util.IOHelper;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

/**
 * Generate the developer HTML files using the individual JS files
 */
public class GenerateDevFiles {
    private final String baseDir;
    private final File sourceDir;
    private final File outputDir;
    private final File appSourceDir;
    private Set<String> jsFiles = new TreeSet<String>();
    private String devIndexHtml = "index-dev.html";
    private String appJsFile = "app/app.js";
    private List<String> jsFileList;

    public static void main(String[] args) {
        String outputDir = Main.getWebAppOutputDir();
        if (args.length > 0) {
            outputDir = args[0];
        }
        try {
            new GenerateDevFiles(outputDir).run();
        } catch (Exception e) {
            System.out.println("Failed: " + e);
            e.printStackTrace();
        }
    }

    public GenerateDevFiles(String outputDir) {
        this.outputDir = new File(outputDir);
        this.baseDir = System.getProperty("basedir", ".");
        sourceDir = new File(new File(baseDir), "src/main/webapp");
        appSourceDir = new File(sourceDir, "app");
    }

    public String getDevIndexHtml() {
        return devIndexHtml;
    }

    public void setDevIndexHtml(String devIndexHtml) {
        this.devIndexHtml = devIndexHtml;
    }

    public String getAppJsFile() {
        return appJsFile;
    }

    public void setAppJsFile(String appJsFile) {
        this.appJsFile = appJsFile;
    }

    public File getOutputDir() {
        return outputDir;
    }

    public File getSourceDir() {
        return sourceDir;
    }

    /**
     * Performs all the code generation
     */
    public void run() throws IOException {
        // lets iterate through finding a list of all the required JS pluginFolders

        directoryExists(appSourceDir, "source directory");
        File[] pluginFolders = appSourceDir.listFiles();
        if (pluginFolders != null) {
            for (File pluginFolder : pluginFolders) {
                String pluginName = pluginFolder.getName();
                File jsFolder = new File(pluginFolder, "js");
                if (jsFolder.exists() && jsFolder.isDirectory()) {
                    loadJsFiles("app/" + pluginName + "/js", jsFolder);
                }
            }
        }
        reorderFiles();
        generateDevIndexHtml();
        generateAppJS();
    }

    protected void reorderFiles() {
        jsFileList = new ArrayList<String>();

        // lets add things in plugin order
        String[] pluginOrder = {"core", "jmx", "log", "tree", "branding"};
        for (String plugin : pluginOrder) {
            String prefix = "app/" + plugin + "/";
            Iterator<String> iterator = jsFiles.iterator();
            while (iterator.hasNext()) {
                String jsFile = iterator.next();
                if (jsFile.startsWith(prefix)) {
                    jsFileList.add(jsFile);
                    iterator.remove();
                }
            }
        }

        jsFileList.addAll(jsFiles);
    }

    protected void generateAppJS() throws IOException {
        File outputFile = createOutputFile(appJsFile);
        outputFile.getParentFile().mkdirs();
        FileWriter writer = new FileWriter(outputFile);
        try {
            for (String jsFileName : jsFileList) {
                File jsFile = new File(sourceDir, jsFileName);
                fileExists(jsFile);
                String js = IOHelper.readFully(jsFile);
                writer.write(js);
                writer.write("\n");
            }
        } finally {
            writer.close();
        }
    }


    /**
     * Ensures the given directory exists or throws an exception
     */
    public static void directoryExists(File dir, String kind) {
        if (!dir.exists()) {
            throw new IllegalStateException("No " + kind + "  at: " + dir.getAbsolutePath());
        }
        if (!dir.isDirectory()) {
            throw new IllegalStateException(kind + " is not a directory! " + dir.getAbsolutePath());
        }
    }

    /**
     * Asserts that a file exists and is a file
     */
    public static void fileExists(File file) {
        if (!file.exists() || !file.isFile()) {
            throw new IllegalStateException("File does not exist " + file.getAbsolutePath());
        }
    }

    protected void generateDevIndexHtml() throws IOException {
        File indexHtml = new File(sourceDir, "index.html");
        fileExists(indexHtml);
        File outputFile = createOutputFile(devIndexHtml);

        String html = IOHelper.readFully(indexHtml);
        // TODO using a regex would be a little more resilient
        String scriptTag = "<script type=\"text/javascript\" src=\"app/app.js\"></script>";
        int idx = html.indexOf(scriptTag);
        if (idx < 0) {
            throw new IllegalStateException("Could not find the script tag: " + scriptTag + " in " + indexHtml.getAbsolutePath());
        }
        StringBuilder buffer = new StringBuilder(html.substring(0, idx));
        addScriptTags(buffer);
        buffer.append(html.substring(idx + scriptTag.length()));
        String newHtml = buffer.toString();

        IOHelper.write(outputFile, newHtml);
        System.out.println("Generated developer file " + outputFile.getAbsolutePath());
    }

    protected File createOutputFile(String outputFileName) {
        outputDir.mkdirs();
        directoryExists(outputDir, "output directory");
        return new File(outputDir, outputFileName);
    }

    protected void addScriptTags(StringBuilder buffer) {
        for (String jsFile : jsFileList) {
            buffer.append("<script type=\"text/javascript\" src=\"");
            buffer.append(jsFile);
            buffer.append("\"></script>");
            buffer.append("\n    ");
        }
    }

    protected void loadJsFiles(String path, File jsFolder) {
        File[] files = jsFolder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isFile()) {
                    String name = file.getName();
                    if (name.endsWith(".js")) {
                        jsFiles.add(path + "/" + name);
                    } else if (name.endsWith(".ts")) {
                        String jsName = name.substring(0, name.length() - 2) + "js";
                        jsFiles.add(path + "/" + jsName);
                    }
                }
            }
        }
    }
}

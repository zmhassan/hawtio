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

import javax.annotation.Generated;
import java.io.File;
import java.io.IOException;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.Callable;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Generate the developer HTML files using the individual JS files
 */
public class GenerateDevFiles {
    private final String baseDir;
    private final File sourceDir;
    private final File outputDir;
    private Set<String> jsFiles = new TreeSet<String>();
    private String devIndexHtml = "index-dev.html";

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
    }


    public void run() throws IOException {
        // lets iterate through finding a list of all the required JS pluginFolders
        File appSourceDir = new File(sourceDir, "app");

        assertDirectoryExists(appSourceDir, "source directory");
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

        generateDevIndexHtml();
    }

    public static void assertDirectoryExists(File appSourceDir, String kind) {
        if (!appSourceDir.exists()) {
            throw new IllegalStateException("No " + kind + "  at: " + appSourceDir.getAbsolutePath());
        }
        if (!appSourceDir.isDirectory()) {
            throw new IllegalStateException(kind + " is not a directory! " + appSourceDir.getAbsolutePath());
        }
    }

    protected void generateDevIndexHtml() throws IOException {
        File indexHtml = new File(sourceDir, "index.html");
        if (!indexHtml.exists() || !indexHtml.isFile()) {
            throw new IllegalStateException("Source does not exist " + indexHtml.getAbsolutePath());
        }
        outputDir.mkdirs();
        assertDirectoryExists(outputDir, "output directory");
        File outputFile = new File(outputDir, devIndexHtml);

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

    protected void addScriptTags(StringBuilder buffer) {
        for (String jsFile : jsFiles) {
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

var templates_dir = "templates/";

var templates_dir_uri = github
        .user("texty")
        .repo("texty-templates")
        .getUri(templates_dir);

github.dir(templates_dir_uri, function(dir) {
    var folders = dir.filter(function(d) {
        return d.type === "dir";
    });

    folders.forEach(function(d) {
        var rel_uri = github.getRelativeUri(templates_dir, d);
        $("#template-select").append('<option value="' + rel_uri + '">'  + rel_uri + "</option>");
    });

    $("#btn-generate").on("click", function() {
        var template = $("#template-select").val();
        var arr = template.split("/");

        var last = arr[arr.length - 1];
        engine.zip(templates_dir + last, preprocessor, function(zip) {
            saveAs(zip, last + ".zip");


        });
    });
    console.log(folders);

    function preprocessor(file) {
        var relative = github.getRelativeUri("templates", file);
        if (!/\.html$/.test(relative)) return file;

        console.log("Matched");
        console.log(file);

        var decoded = Base64.decode(file.content);
        var replaced = replace(decoded);
        file.content = Base64.encode(replaced);

        return file;
    }

    function replace(original) {
        //todo

        var modified = original;

        return modified;
    }
});

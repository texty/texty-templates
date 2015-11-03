var templates_dir = github
        .user("texty")
        .repo("texty-templates")
        .getUri("templates");

github.dir(templates_dir, function(dir) {
    var folders = dir.filter(function(d) {
        return d.type === "dir";
    });

    folders.forEach(function(d) {
        $("#template-select").append('<option value="' + github.getRelativeUri(d) + '">'  + github.getRelativeUri(d) + "</option>");
    });

    console.log(folders);
});

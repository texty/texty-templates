(function() {

    var templates_dir = "templates/";

    var templates_dir_uri = github
            .user("texty")
            .repo("texty-templates")
            .getUri(templates_dir);

    github.dir(templates_dir_uri, function(dir) {
        // if ok
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

    }, function(err) {
        // if err
        console.log(err);
        error();
    });

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
        var variables = $("[variable-name]")
            .toArray()
            .reduce(function(o,v,i){
                var el = $(v);
                o[el.attr("variable-name")] = el.val();
                return o;
            }, {});

        var modified = original;
        Object.keys(variables).forEach(function(k) {
            var v = variables[k];

            var regx = new RegExp(k, "g");

            modified = modified.replace(regx, v);
        });

        return modified;
    }

    function error() {
        var div = '<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Помилка! </strong>Перевищено ліміт Github API</div>'
        $("#error-box").append(div);
    }

})();

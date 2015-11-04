var engine = (function () {

    var module = {};

    module.zip = function(root, preprocessor, cb) {
        var zip = new JSZip();

        var rootUri = github
            .user("texty")
            .repo("texty-templates")
            .getUri(root);

        github
            .walk(rootUri, function (file) {
                var uri = github.getRelativeUri(root, file);
                console.log(uri);

                file = preprocessor(file);
                info("Zipping " + uri + " ...");

                zip.file(uri, file.content, {base64: true});
            }, function () {
                info("Generating download...");
                var content = zip.generate({type: "blob"});

                cb(content);
            });
    };


    function info(text) {
        $("#info").text(text);
    }

    return module;
})();
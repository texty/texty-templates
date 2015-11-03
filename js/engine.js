var engine = (function () {

    var module = {};

    module.zip = function(root, cb) {
        var zip = new JSZip();

        var rootUri = github
            .user("texty")
            .repo("texty-templates")
            .getUri(root);

        github
            .walk(rootUri, function (file, uri) {
                info("Zipping " + uri + " ...");
                zip.file(uri, file.content, {base64: true});
            }, function () {
                info("Generating download...");
                var content = zip.generate({type: "blob"});

                cb(content);
//                saveAs(content, "template.zip");
//                info("Done");
            });
    };


    function info(text) {
        $("#info").text(text);
    }

    return module;
})();
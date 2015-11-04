var github = (function($) {
    var module = {}
        , baseUri = "https://api.github.com"
        , user
        , repo
        ;

    module.repo = function(_) {
        if (!arguments.length) return repo;
        repo = _;
        return module;
    };

    module.user = function(_) {
        if (!arguments.length) return user;
        user = _;
        return module;
    };

    module.walk = function(url, fileCb, cb) {
        walk(url, fileCb, cb);
    };

    module.file = function(file, fileCb, cb) {
        $.getJSON(file.url)
            .success(function(file) {
                fileCb(file);
                return cb();
            })
            .error(error);
    };

    module.getUri = function(path) {
        return baseUri + "/repos/" + user + "/" + repo + "/contents/" + path;
    };

    function walk(url, fileCb, cb) {
        $.getJSON(url)
            .success(function(json) {
                var tasks = json.map(function(d) {
                    if (d.type === "file") return function(cb) {module.file(d, fileCb, cb)};
                    if (d.type === "dir") return function(cb) {walk(d.url, fileCb, cb)};
                    throw "Neither file or dir";
                });

                async.parallel(tasks, function(err) {
                    cb();
                });
            })
            .error(error);
    }

    module.getRelativeUri = function(root, file) {
        return file.url.replace(module.getUri(root), "").split("?")[0];
    };

    module.dir = function(url, callback) {
        $.getJSON(url)
            .success(callback)
            .error(error);
    };

    return module;

    function error(err) {
        var msg = err.responseJSON.message;

        var div = '<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
            + '<strong>Помилка! </strong>'
            + msg
            + '</div>';
        $("#error-box").append(div);
    }
})($);


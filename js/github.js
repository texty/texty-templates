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
        $.getJSON(file.url, function(file) {
            fileCb(file);
            return cb();
        });
    };

    module.getUri = function(path) {
        return baseUri + "/repos/" + user + "/" + repo + "/contents/" + path;
    };

    function walk(url, fileCb, cb) {
        $.getJSON(url, function(json) {
            var tasks = json.map(function(d) {
                if (d.type === "file") return function(cb) {module.file(d, fileCb, cb)};
                if (d.type === "dir") return function(cb) {walk(d.url, fileCb, cb)};
                throw "Neither file or dir";
            });

            async.parallel(tasks, function(err) {
                cb();
            });
        });
    }

    module.getRelativeUri = function(root, file) {
        return file.url.replace(module.getUri(root), "").split("?")[0];
    };

    module.dir = function(url, callback, err_cb) {
        $.getJSON(url)
            .success(callback)
            .error(err_cb);
    };

    return module;
})($);


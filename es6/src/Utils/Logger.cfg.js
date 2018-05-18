define({
    loggers : [
        {
            root : true,
            level : "all",
            appenders : [
                {
                    type : "Console",
                    layout : {
                        type : "PatternLayout",
                        pattern : "%d{yyyy-MM-dd HH:mm:ss} [%p] %c - %m%n"
                    }
                }
            ]
        }
    ]
});
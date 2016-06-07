@App.module "Utilities", (Utilities, App, Backbone, Marionette, $, _) ->

  element = "__cypress-string"

  API =
    start: (socketId) ->
      ## connect to socket io
      channel = io.connect({path: "/__socket.io"})

      channel.on "connect", ->
        channel.emit "reporter:connected"

      ## TODO: rename this event its confusing
      ## should be something like watched:file:changed
      channel.on "test:changed", (data) ->
        socket.trigger "test:changed", data.file

      channel.on "run:start", ->
        socket.trigger "run:start"

      channel.on "run:end", ->
        socket.trigger "run:end"

      channel.on "test:before:hooks", (test) ->
        socket.trigger "test:before:hooks", test

      channel.on "test:after:hooks", (test) ->
        socket.trigger "test:after:hooks", test

      channel.on "reporter:log:add", (log) ->
        socket.trigger "reporter:log:add", log

      channel.on "reporter:log:state:changed", (log) ->
        socket.trigger "reporter:log:state:changed", log

      channel.on "runnables:ready", (root) ->
        socket.trigger "runnables:ready", root

      channel.on "reporter:restart:test:run", ->
        socket.trigger "reporter:restart:test:run"

      channel.on "cypress:css:changed", (data) ->
        ## find the cypress stylesheet
        link = $("link").filter (index, link) ->
          ## replace a period with 1 back slash
          re = data.file.split(".").join("\\.")
          new RegExp(re).test $(link).attr("href")

        ## get the relative href excluding host, domain, etc
        href = new Uri(link.attr("href"))

        ## append a random time after it
        href.replaceQueryParam "t", _.now()

        ## set it back on the link
        link.attr("href", href.toString())

      ## create the app socket entity
      socket = App.request "io:entity", channel, socketId

      App.reqres.setHandler "socket:entity", -> socket

  App.commands.setHandler "socket:start", (socketId) ->
    API.start(socketId)

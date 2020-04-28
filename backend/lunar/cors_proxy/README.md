thingproxy (Configured Specifically for Crypto Exchanges) 
==========

A simple forward proxy server for processing API calls to servers that don't send CORS headers or support HTTPS.

### what?

thingproxy allows javascript code on your site to access resources on other domains that would normally be blocked due to the [same-origin policy](http://en.wikipedia.org/wiki/Same_origin_policy). It acts as a proxy between your browser and a remote server and adds the proper CORS headers to the response.

In addition, some browsers don't allow requests for non-encrypted HTTP data if the page itself is loaded from HTTPS. thingproxy also allows you to access non-secure HTTP API's from a secure HTTPS url. 

We encourage you to run your own thingproxy server with this source code, but freeboard.io offers a free proxy available at:

http://thingproxy.freeboard.io and https://thingproxy.freeboard.io

### why?

Dashboards created with freeboard normally access APIs directly from ajax calls from javascript. Many API providers do not provide the proper CORS headers, or don't support HTTPS— thingproxy is provided to overcome these limitations.

### how?

Just prefix any url with http(s)://thingproxy.freeboard.io/fetch/

For example:

```
https://thingproxy.freeboard.io/fetch/http://my.api.com/get/stuff
```

Any HTTP method, headers and body you send, will be sent to the URL you specify and the response will be sent back to you with the proper CORS headers attached.

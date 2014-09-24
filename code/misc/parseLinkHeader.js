function parseLinkHeader(jqXhr) {
  var regex = /<(http.*?)>; rel="([a-z]*)",/g;
  var link;
  var links = {};
  var header = jqXhr.getResponseHeader('Link');
  if (!header)
    return links;
  while (link = regex.exec(header))
    links[link[2]] = link[1];
  return links;
}


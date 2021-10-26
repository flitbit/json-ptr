<!DOCTYPE html><html class="default no-js"><head><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="IE=edge"/><title>json-ptr</title><meta name="description" content="Documentation for json-ptr"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="assets/style.css"/><link rel="stylesheet" href="assets/highlight.css"/><script async src="assets/search.js" id="search-script"></script></head><body><script>document.body.classList.add(localStorage.getItem("tsd-theme") || "os")</script><header><div class="tsd-page-toolbar"><div class="container"><div class="table-wrap"><div class="table-cell" id="tsd-search" data-base="."><div class="field"><label for="tsd-search-field" class="tsd-widget search no-caption">Search</label><input type="text" id="tsd-search-field"/></div><ul class="results"><li class="state loading">Preparing search index...</li><li class="state failure">The search index is not available</li></ul><a href="index.html" class="title">json-ptr</a></div><div class="table-cell" id="tsd-widgets"><div id="tsd-filter"><a href="#" class="tsd-widget options no-caption" data-toggle="options">Options</a><div class="tsd-filter-group"><div class="tsd-select" id="tsd-filter-visibility"><span class="tsd-select-label">All</span><ul class="tsd-select-list"><li data-value="public">Public</li><li data-value="protected">Public/Protected</li><li data-value="private" class="selected">All</li></ul></div> <input type="checkbox" id="tsd-filter-inherited" checked/><label class="tsd-widget" for="tsd-filter-inherited">Inherited</label><input type="checkbox" id="tsd-filter-externals" checked/><label class="tsd-widget" for="tsd-filter-externals">Externals</label></div></div><a href="#" class="tsd-widget menu no-caption" data-toggle="menu">Menu</a></div></div></div></div><div class="tsd-page-title"><div class="container"><h1>json-ptr</h1></div></div></header><div class="container container-main"><div class="row"><div class="col-8 col-content"><div class="tsd-panel tsd-typography">
<a href="#json-ptr" id="json-ptr" style="color: inherit; text-decoration: none;">
  <h1>json-ptr</h1>
</a>
<p><a href="https://circleci.com/gh/flitbit/json-ptr/tree/master"><img src="https://circleci.com/gh/flitbit/json-ptr/tree/master.svg?style=svg" alt="CircleCI"></a> <a href="https://codecov.io/gh/flitbit/json-ptr"><img src="https://codecov.io/gh/flitbit/json-ptr/branch/master/graph/badge.svg" alt="codecov"></a></p>
<p>A complete implementation of JSON Pointer (<a href="https://tools.ietf.org/html/rfc6901">RFC 6901</a>) for nodejs and modern browsers.</p>
<p>Supports <a href="https://tools.ietf.org/id/draft-handrews-relative-json-pointer-00.html">Relative JSON Pointers</a>. (<a href="https://github.com/flitbit/json-ptr/blob/487182100a08f4ddc7713e42ec063bbd5ce2c34c/examples/relative.js">Example</a>)</p>

<a href="#background" id="background" style="color: inherit; text-decoration: none;">
  <h2>Background</h2>
</a>
<p>I wrote this a few years back when I was unable to find a <em>complete implementation</em> of <a href="https://tools.ietf.org/html/rfc6901">RFC 6901</a>. It turns out that I now use the hell out of it. I hope you also find it useful.</p>

<a href="#install" id="install" style="color: inherit; text-decoration: none;">
  <h2>Install</h2>
</a>
<pre><code class="language-bash"><span class="hl-0">npm install json-ptr</span>
</code></pre>

<a href="#use" id="use" style="color: inherit; text-decoration: none;">
  <h2>Use</h2>
</a>
<p>Both ESM and CJS are supported.</p>
<pre><code class="language-javascript"><span class="hl-1">import</span><span class="hl-0"> { </span><span class="hl-2">JsonPointer</span><span class="hl-0"> } </span><span class="hl-1">from</span><span class="hl-0"> </span><span class="hl-3">&#39;json-ptr&#39;</span><span class="hl-0">;</span>
</code></pre>

<a href="#bundling-and-the-browser" id="bundling-and-the-browser" style="color: inherit; text-decoration: none;">
  <h2>Bundling and the Browser</h2>
</a>
<p>As of v3.0.0 we no longer provide a browser ready bundle. Instead, we support both ESM and CJS so you can use your favorite bundler (webpack or rollup) to tree-shake and create your own optimized bundle.</p>

<a href="#api-documentation" id="api-documentation" style="color: inherit; text-decoration: none;">
  <h2>API Documentation</h2>
</a>
<p>The <a href="http://flitbit.github.io/json-ptr/">API documentation is generated from code by typedoc and hosted here</a>. Read the docs.</p>
<p>Documentation is always a work in progress, let us know by creating an issue if you need a scenario documented.</p>

<a href="#example" id="example" style="color: inherit; text-decoration: none;">
  <h3>Example</h3>
</a>
<p>There are many uses for JSON Pointers, here&#39;s one we encountered when we updated a public API and suddenly had clients sending two different message bodies to our APIs. This example is contrived to illustrate how we supported both new and old incoming messages:</p>
<pre><code class="language-ts"><span class="hl-4">// examples/versions.ts</span><br/><span class="hl-1">import</span><span class="hl-0"> { </span><span class="hl-2">JsonPointer</span><span class="hl-0"> } </span><span class="hl-1">from</span><span class="hl-0"> </span><span class="hl-3">&#39;json-ptr&#39;</span><span class="hl-0">;</span><br/><br/><span class="hl-1">export</span><span class="hl-0"> </span><span class="hl-5">type</span><span class="hl-0"> </span><span class="hl-6">SupportedVersion</span><span class="hl-0"> = </span><span class="hl-3">&#39;1.0&#39;</span><span class="hl-0"> | </span><span class="hl-3">&#39;1.1&#39;</span><span class="hl-0">;</span><br/><br/><span class="hl-5">interface</span><span class="hl-0"> </span><span class="hl-6">PrimaryGuestNamePointers</span><span class="hl-0"> {</span><br/><span class="hl-0">  </span><span class="hl-2">name</span><span class="hl-0">: </span><span class="hl-6">JsonPointer</span><span class="hl-0">;</span><br/><span class="hl-0">  </span><span class="hl-2">surname</span><span class="hl-0">: </span><span class="hl-6">JsonPointer</span><span class="hl-0">;</span><br/><span class="hl-0">  </span><span class="hl-2">honorific</span><span class="hl-0">: </span><span class="hl-6">JsonPointer</span><span class="hl-0">;</span><br/><span class="hl-0">}</span><br/><span class="hl-5">const</span><span class="hl-0"> </span><span class="hl-7">versions</span><span class="hl-0">: </span><span class="hl-6">Record</span><span class="hl-0">&lt;</span><span class="hl-6">SupportedVersion</span><span class="hl-0">, </span><span class="hl-6">PrimaryGuestNamePointers</span><span class="hl-0">&gt; = {</span><br/><span class="hl-0">  </span><span class="hl-3">&#39;1.0&#39;</span><span class="hl-2">:</span><span class="hl-0"> {</span><br/><span class="hl-0">    </span><span class="hl-2">name:</span><span class="hl-0"> </span><span class="hl-2">JsonPointer</span><span class="hl-0">.</span><span class="hl-8">create</span><span class="hl-0">(</span><span class="hl-3">&#39;/guests/0/name&#39;</span><span class="hl-0">),</span><br/><span class="hl-0">    </span><span class="hl-2">surname:</span><span class="hl-0"> </span><span class="hl-2">JsonPointer</span><span class="hl-0">.</span><span class="hl-8">create</span><span class="hl-0">(</span><span class="hl-3">&#39;/guests/0/surname&#39;</span><span class="hl-0">),</span><br/><span class="hl-0">    </span><span class="hl-2">honorific:</span><span class="hl-0"> </span><span class="hl-2">JsonPointer</span><span class="hl-0">.</span><span class="hl-8">create</span><span class="hl-0">(</span><span class="hl-3">&#39;/guests/0/honorific&#39;</span><span class="hl-0">),</span><br/><span class="hl-0">  },</span><br/><span class="hl-0">  </span><span class="hl-3">&#39;1.1&#39;</span><span class="hl-2">:</span><span class="hl-0"> {</span><br/><span class="hl-0">    </span><span class="hl-2">name:</span><span class="hl-0"> </span><span class="hl-2">JsonPointer</span><span class="hl-0">.</span><span class="hl-8">create</span><span class="hl-0">(</span><span class="hl-3">&#39;/primary/primaryGuest/name&#39;</span><span class="hl-0">),</span><br/><span class="hl-0">    </span><span class="hl-2">surname:</span><span class="hl-0"> </span><span class="hl-2">JsonPointer</span><span class="hl-0">.</span><span class="hl-8">create</span><span class="hl-0">(</span><span class="hl-3">&#39;/primary/primaryGuest/surname&#39;</span><span class="hl-0">),</span><br/><span class="hl-0">    </span><span class="hl-2">honorific:</span><span class="hl-0"> </span><span class="hl-2">JsonPointer</span><span class="hl-0">.</span><span class="hl-8">create</span><span class="hl-0">(</span><span class="hl-3">&#39;/primary/primaryGuest/honorific&#39;</span><span class="hl-0">),</span><br/><span class="hl-0">  },</span><br/><span class="hl-0">};</span><br/><br/><span class="hl-5">interface</span><span class="hl-0"> </span><span class="hl-6">Reservation</span><span class="hl-0"> </span><span class="hl-5">extends</span><span class="hl-0"> </span><span class="hl-6">Record</span><span class="hl-0">&lt;</span><span class="hl-6">string</span><span class="hl-0">, </span><span class="hl-6">unknown</span><span class="hl-0">&gt; {</span><br/><span class="hl-0">  </span><span class="hl-2">version</span><span class="hl-0">?: </span><span class="hl-6">SupportedVersion</span><span class="hl-0">;</span><br/><span class="hl-0">}</span><br/><br/><span class="hl-4">/**</span><br/><span class="hl-4"> * Gets the primary guest&#39;s name from the specified reservation.</span><br/><span class="hl-4"> * </span><span class="hl-5">@param</span><span class="hl-4"> </span><span class="hl-2">reservation</span><span class="hl-4"> a reservation, either version 1.0 or bearing a `version`</span><br/><span class="hl-4"> * property indicating the version.</span><br/><span class="hl-4"> */</span><br/><span class="hl-5">function</span><span class="hl-0"> </span><span class="hl-8">primaryGuestName</span><span class="hl-0">(</span><span class="hl-2">reservation</span><span class="hl-0">: </span><span class="hl-6">Reservation</span><span class="hl-0">): </span><span class="hl-6">string</span><span class="hl-0"> {</span><br/><span class="hl-0">  </span><span class="hl-5">const</span><span class="hl-0"> </span><span class="hl-7">pointers</span><span class="hl-0"> = </span><span class="hl-2">versions</span><span class="hl-0">[</span><span class="hl-2">reservation</span><span class="hl-0">.</span><span class="hl-2">version</span><span class="hl-0"> || </span><span class="hl-3">&#39;1.0&#39;</span><span class="hl-0">];</span><br/><span class="hl-0">  </span><span class="hl-1">if</span><span class="hl-0"> (!</span><span class="hl-2">pointers</span><span class="hl-0">) {</span><br/><span class="hl-0">    </span><span class="hl-1">throw</span><span class="hl-0"> </span><span class="hl-5">new</span><span class="hl-0"> </span><span class="hl-6">Error</span><span class="hl-0">(</span><span class="hl-3">`Unsupported reservation version: </span><span class="hl-5">${</span><span class="hl-2">reservation</span><span class="hl-9">.</span><span class="hl-2">version</span><span class="hl-5">}</span><span class="hl-3">`</span><span class="hl-0">);</span><br/><span class="hl-0">  }</span><br/><span class="hl-0">  </span><span class="hl-5">const</span><span class="hl-0"> </span><span class="hl-7">name</span><span class="hl-0"> = </span><span class="hl-2">pointers</span><span class="hl-0">.</span><span class="hl-2">name</span><span class="hl-0">.</span><span class="hl-8">get</span><span class="hl-0">(</span><span class="hl-2">reservation</span><span class="hl-0">) </span><span class="hl-1">as</span><span class="hl-0"> </span><span class="hl-6">string</span><span class="hl-0">;</span><br/><span class="hl-0">  </span><span class="hl-5">const</span><span class="hl-0"> </span><span class="hl-7">surname</span><span class="hl-0"> = </span><span class="hl-2">pointers</span><span class="hl-0">.</span><span class="hl-2">surname</span><span class="hl-0">.</span><span class="hl-8">get</span><span class="hl-0">(</span><span class="hl-2">reservation</span><span class="hl-0">) </span><span class="hl-1">as</span><span class="hl-0"> </span><span class="hl-6">string</span><span class="hl-0">;</span><br/><span class="hl-0">  </span><span class="hl-5">const</span><span class="hl-0"> </span><span class="hl-7">honorific</span><span class="hl-0"> = </span><span class="hl-2">pointers</span><span class="hl-0">.</span><span class="hl-2">honorific</span><span class="hl-0">.</span><span class="hl-8">get</span><span class="hl-0">(</span><span class="hl-2">reservation</span><span class="hl-0">) </span><span class="hl-1">as</span><span class="hl-0"> </span><span class="hl-6">string</span><span class="hl-0">;</span><br/><span class="hl-0">  </span><span class="hl-5">const</span><span class="hl-0"> </span><span class="hl-7">names</span><span class="hl-0">: </span><span class="hl-6">string</span><span class="hl-0">[] = [];</span><br/><span class="hl-0">  </span><span class="hl-1">if</span><span class="hl-0"> (</span><span class="hl-2">honorific</span><span class="hl-0">) </span><span class="hl-2">names</span><span class="hl-0">.</span><span class="hl-8">push</span><span class="hl-0">(</span><span class="hl-2">honorific</span><span class="hl-0">);</span><br/><span class="hl-0">  </span><span class="hl-1">if</span><span class="hl-0"> (</span><span class="hl-2">name</span><span class="hl-0">) </span><span class="hl-2">names</span><span class="hl-0">.</span><span class="hl-8">push</span><span class="hl-0">(</span><span class="hl-2">name</span><span class="hl-0">);</span><br/><span class="hl-0">  </span><span class="hl-1">if</span><span class="hl-0"> (</span><span class="hl-2">surname</span><span class="hl-0">) </span><span class="hl-2">names</span><span class="hl-0">.</span><span class="hl-8">push</span><span class="hl-0">(</span><span class="hl-2">surname</span><span class="hl-0">);</span><br/><span class="hl-0">  </span><span class="hl-1">return</span><span class="hl-0"> </span><span class="hl-2">names</span><span class="hl-0">.</span><span class="hl-8">join</span><span class="hl-0">(</span><span class="hl-3">&#39; &#39;</span><span class="hl-0">);</span><br/><span class="hl-0">}</span><br/><br/><span class="hl-4">// The original layout of a reservation (only the parts relevant to our example)</span><br/><span class="hl-5">const</span><span class="hl-0"> </span><span class="hl-7">reservationV1</span><span class="hl-0">: </span><span class="hl-6">Reservation</span><span class="hl-0"> = {</span><br/><span class="hl-0">  </span><span class="hl-2">guests:</span><span class="hl-0"> [</span><br/><span class="hl-0">    {</span><br/><span class="hl-0">      </span><span class="hl-2">name:</span><span class="hl-0"> </span><span class="hl-3">&#39;Wilbur&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">      </span><span class="hl-2">surname:</span><span class="hl-0"> </span><span class="hl-3">&#39;Finkle&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">      </span><span class="hl-2">honorific:</span><span class="hl-0"> </span><span class="hl-3">&#39;Mr.&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">    },</span><br/><span class="hl-0">    {</span><br/><span class="hl-0">      </span><span class="hl-2">name:</span><span class="hl-0"> </span><span class="hl-3">&#39;Wanda&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">      </span><span class="hl-2">surname:</span><span class="hl-0"> </span><span class="hl-3">&#39;Finkle&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">      </span><span class="hl-2">honorific:</span><span class="hl-0"> </span><span class="hl-3">&#39;Mrs.&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">    },</span><br/><span class="hl-0">    {</span><br/><span class="hl-0">      </span><span class="hl-2">name:</span><span class="hl-0"> </span><span class="hl-3">&#39;Wilma&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">      </span><span class="hl-2">surname:</span><span class="hl-0"> </span><span class="hl-3">&#39;Finkle&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">      </span><span class="hl-2">honorific:</span><span class="hl-0"> </span><span class="hl-3">&#39;Miss&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">      </span><span class="hl-2">child:</span><span class="hl-0"> </span><span class="hl-5">true</span><span class="hl-0">,</span><br/><span class="hl-0">      </span><span class="hl-2">age:</span><span class="hl-0"> </span><span class="hl-10">12</span><span class="hl-0">,</span><br/><span class="hl-0">    },</span><br/><span class="hl-0">  ],</span><br/><span class="hl-0">  </span><span class="hl-4">// ...</span><br/><span class="hl-0">};</span><br/><br/><span class="hl-4">// The new layout of a reservation (only the parts relevant to our example)</span><br/><span class="hl-5">const</span><span class="hl-0"> </span><span class="hl-7">reservationV1_1</span><span class="hl-0">: </span><span class="hl-6">Reservation</span><span class="hl-0"> = {</span><br/><span class="hl-0">  </span><span class="hl-2">version:</span><span class="hl-0"> </span><span class="hl-3">&#39;1.1&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">  </span><span class="hl-2">primary:</span><span class="hl-0"> {</span><br/><span class="hl-0">    </span><span class="hl-2">primaryGuest:</span><span class="hl-0"> {</span><br/><span class="hl-0">      </span><span class="hl-2">name:</span><span class="hl-0"> </span><span class="hl-3">&#39;Wilbur&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">      </span><span class="hl-2">surname:</span><span class="hl-0"> </span><span class="hl-3">&#39;Finkle&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">      </span><span class="hl-2">honorific:</span><span class="hl-0"> </span><span class="hl-3">&#39;Mr.&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">    },</span><br/><span class="hl-0">    </span><span class="hl-2">additionalGuests:</span><span class="hl-0"> [</span><br/><span class="hl-0">      {</span><br/><span class="hl-0">        </span><span class="hl-2">name:</span><span class="hl-0"> </span><span class="hl-3">&#39;Wanda&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">        </span><span class="hl-2">surname:</span><span class="hl-0"> </span><span class="hl-3">&#39;Finkle&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">        </span><span class="hl-2">honorific:</span><span class="hl-0"> </span><span class="hl-3">&#39;Mrs.&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">      },</span><br/><span class="hl-0">      {</span><br/><span class="hl-0">        </span><span class="hl-2">name:</span><span class="hl-0"> </span><span class="hl-3">&#39;Wilma&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">        </span><span class="hl-2">surname:</span><span class="hl-0"> </span><span class="hl-3">&#39;Finkle&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">        </span><span class="hl-2">honorific:</span><span class="hl-0"> </span><span class="hl-3">&#39;Miss&#39;</span><span class="hl-0">,</span><br/><span class="hl-0">        </span><span class="hl-2">child:</span><span class="hl-0"> </span><span class="hl-5">true</span><span class="hl-0">,</span><br/><span class="hl-0">        </span><span class="hl-2">age:</span><span class="hl-0"> </span><span class="hl-10">12</span><span class="hl-0">,</span><br/><span class="hl-0">      },</span><br/><span class="hl-0">    ],</span><br/><span class="hl-0">    </span><span class="hl-4">// ...</span><br/><span class="hl-0">  },</span><br/><span class="hl-0">  </span><span class="hl-4">// ...</span><br/><span class="hl-0">};</span><br/><br/><span class="hl-2">console</span><span class="hl-0">.</span><span class="hl-8">log</span><span class="hl-0">(</span><span class="hl-8">primaryGuestName</span><span class="hl-0">(</span><span class="hl-2">reservationV1</span><span class="hl-0">));</span><br/><span class="hl-2">console</span><span class="hl-0">.</span><span class="hl-8">log</span><span class="hl-0">(</span><span class="hl-8">primaryGuestName</span><span class="hl-0">(</span><span class="hl-2">reservationV1_1</span><span class="hl-0">));</span>
</code></pre>

<a href="#security-vulnerabilities-resolved" id="security-vulnerabilities-resolved" style="color: inherit; text-decoration: none;">
  <h2>Security Vulnerabilities (resolved)</h2>
</a>
<ul>
<li><p><strong>prior to v3.0.0</strong> there was a security vulnerabilitywhich allowed a developer to perform prototype pollution by sending malformed path segments to <code>json-ptr</code>. If you were one of these developers, you should upgrade to v3.0.0 immediately, and stop using <code>json-ptr</code> to pollute an object&#39;s prototype. If you feel you have a legitimate reason to do so, please use another method and leave <code>json-ptr</code> out of it. Such behavior has been disallowed since it can easily be done using plain ol javascript by those determined to violate common best practice.</p>
</li>
<li><p><strong>prior to v2.1.0</strong> there was a security vulnerability which allowed an unscrupulous actor to execute arbitrary code if developers failed to sanitize user input before sending it to <code>json-ptr</code>. If your code does not sanitize user input before sending it to <code>json-ptr</code>, your project is vulnerable and you should upgrade to v3.0.0 immediately. And while your at it, start sanitized user input before sending it to <code>json-ptr</code>.</p>
</li>
</ul>

<a href="#breaking-changes-at-v130" id="breaking-changes-at-v130" style="color: inherit; text-decoration: none;">
  <h2>Breaking Changes at v1.3.0</h2>
</a>
<p>As was rightly pointed out in <a href="https://github.com/flitbit/json-ptr/issues/24">this issue</a>, I should have rolled the major version at <code>v1.3.0</code> instead of the minor version due to <a href="#user-content-where-did-the-global-functions-go">breaking changes to the API</a>. Not the worst blunder I&#39;ve made, but my apologies all the same. Since the ship has sailed, I&#39;m boosting the visibility of these breaking changes.</p>

<a href="#where-did-the-global-functions-go" id="where-did-the-global-functions-go" style="color: inherit; text-decoration: none;">
  <h3>Where did the Global Functions Go?</h3>
</a>
<p>In version <code>v1.3.0</code> of the library, global functions were moved to static functions of the <code>JsonPointer</code> class. There should be no difference in arguments or behavior. If you were previously importing the global functions it is a small change to destructure them and have compatible code.</p>
<table>
<thead>
<tr>
<th>Global Fn</th>
<th>Static Fn</th>
<th>Documentation</th>
</tr>
</thead>
<tbody><tr>
<td><code>create()</code></td>
<td><code>JsonPointer.create()</code></td>
<td><a href="http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#create">Factory function that creates a <code>JsonPointer</code></a></td>
</tr>
<tr>
<td><code>decode()</code></td>
<td><code>JsonPointer.decode()</code></td>
<td><a href="http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#decode">Decodes the specified pointer into path segments.</a></td>
</tr>
<tr>
<td><code>flatten()</code></td>
<td><code>JsonPointer.flatten()</code></td>
<td><a href="http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#flatten">DEvaluates the target&#39;s object graph, returning a Record&lt;Pointer, unknown&gt; populated with pointers and the corresponding values from the graph..</a></td>
</tr>
<tr>
<td><code>get()</code></td>
<td><code>JsonPointer.get()</code></td>
<td><a href="http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#get">Gets the target object&#39;s value at the pointer&#39;s location.</a></td>
</tr>
<tr>
<td><code>has()</code></td>
<td><code>JsonPointer.has()</code></td>
<td><a href="http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#has">Determines if the specified target&#39;s object graph has a value at the pointer&#39;s location.</a></td>
</tr>
<tr>
<td><code>list()</code></td>
<td></td>
<td>Replaced by <code>JsonPointer.listFragmentIds()</code> and <code>JsonPointer.listPointers()</code>.</td>
</tr>
<tr>
<td><code>listFragmentIds()</code></td>
<td><code>JsonPointer.listFragmentIds()</code></td>
<td><a href="http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#listFragmentIds">Evaluates the target&#39;s object graph, returning a UriFragmentIdentifierPointerListItem for each location in the graph.</a></td>
</tr>
<tr>
<td><code>listPointers()</code></td>
<td><code>JsonPointer.listPointers()</code></td>
<td><a href="http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#listPointers">Evaluates the target&#39;s object graph, returning a JsonStringPointerListItem for each location in the graph.</a></td>
</tr>
<tr>
<td><code>map()</code></td>
<td><code>JsonPointer.map()</code></td>
<td><a href="http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#map">Evaluates the target&#39;s object graph, returning a Map&lt;Pointer,unknown&gt; populated with pointers and the corresponding values form the graph.</a></td>
</tr>
<tr>
<td><code>set()</code></td>
<td><code>JsonPointer.set()</code></td>
<td><a href="http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#set">Sets the target object&#39;s value, as specified, at the pointer&#39;s location.</a></td>
</tr>
<tr>
<td></td>
<td><code>JsonPointer.unset()</code></td>
<td><a href="http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#unset">Removes the target object&#39;s value at the pointer&#39;s location.</a></td>
</tr>
<tr>
<td><code>visit()</code></td>
<td><code>JsonPointer.visit()</code></td>
<td><a href="http://flitbit.github.io/json-ptr/classes/_src_pointer_.jsonpointer.html#visit">Evaluates the target&#39;s object graph, calling the specified visitor for every unique pointer location discovered while walking the graph.</a></td>
</tr>
</tbody></table>

<a href="#tests" id="tests" style="color: inherit; text-decoration: none;">
  <h2>Tests</h2>
</a>
<p>We&#39;re maintaining near 100% test coverage. Visit our <a href="https://app.circleci.com/pipelines/github/flitbit/json-ptr">circleci build page</a> and drill down on a recent build&#39;s <em>build and test</em> step to see where we&#39;re at. It should look something like:</p>
<pre><code class="language-text">=============================== Coverage summary ===============================
Statements   : 100% ( 270/270 )
Branches     : 100% ( 172/172 )
Functions    : 100% ( 49/49 )
Lines        : 100% ( 265/265 )
================================================================================
</code></pre>
<p>We use <a href="https://mochajs.org/">mocha</a> so you can also clone the code and:</p>
<pre><code class="language-text">$ npm install
$ npm test
</code></pre>
<p>Once you&#39;ve run the tests on the command line you can open up <a href="https://github.com/flitbit/json-ptr/blob/master/tests.html">./tests.html</a> in the browser of your choice.</p>

<a href="#performance" id="performance" style="color: inherit; text-decoration: none;">
  <h2>Performance</h2>
</a>
<blockquote>
<p>WARNING! These performance metrics are quite outdated. We&#39;ll be updating as soon as we have time.</p>
</blockquote>
<p>This repository has a <a href="https://github.com/flitbit/json-pointer-comparison">companion repository that makes some performance comparisons</a> between <code>json-ptr</code>, <a href="https://www.npmjs.com/package/jsonpointer"><code>jsonpointer</code></a> and <a href="https://www.npmjs.com/package/json-pointer"><code>json-pointer</code></a>.</p>
<p><strong>All timings are expressed as nanoseconds:</strong></p>
<pre><code class="language-text">.flatten(obj)
...
MODULE       | METHOD  | COMPILED | SAMPLES |       AVG | SLOWER
json-pointer | dict    |          | 10      | 464455181 |
json-ptr     | flatten |          | 10      | 770424039 | 65.88%
jsonpointer  | n/a     |          | -       |         - |

.has(obj, pointer)
...
MODULE       | METHOD | COMPILED | SAMPLES | AVG  | SLOWER
json-ptr     | has    | compiled | 1000000 | 822  |
json-ptr     | has    |          | 1000000 | 1747 | 112.53%
json-pointer | has    |          | 1000000 | 2683 | 226.4%
jsonpointer  | n/a    |          | -       | -    |

.has(obj, fragmentId)
...
MODULE       | METHOD | COMPILED | SAMPLES | AVG  | SLOWER
json-ptr     | has    | compiled | 1000000 | 602  |
json-ptr     | has    |          | 1000000 | 1664 | 176.41%
json-pointer | has    |          | 1000000 | 2569 | 326.74%
jsonpointer  | n/a    |          | -       | -    |

.get(obj, pointer)
...
MODULE       | METHOD | COMPILED | SAMPLES | AVG  | SLOWER
json-ptr     | get    | compiled | 1000000 | 590  |
json-ptr     | get    |          | 1000000 | 1676 | 184.07%
jsonpointer  | get    | compiled | 1000000 | 2102 | 256.27%
jsonpointer  | get    |          | 1000000 | 2377 | 302.88%
json-pointer | get    |          | 1000000 | 2585 | 338.14%

.get(obj, fragmentId)
...
MODULE       | METHOD | COMPILED | SAMPLES | AVG  | SLOWER
json-ptr     | get    | compiled | 1000000 | 587  |
json-ptr     | get    |          | 1000000 | 1673 | 185.01%
jsonpointer  | get    | compiled | 1000000 | 2105 | 258.6%
jsonpointer  | get    |          | 1000000 | 2451 | 317.55%
json-pointer | get    |          | 1000000 | 2619 | 346.17%
</code></pre>
<blockquote>
<p>These results have been elided because there is too much detail in the actual. Your results will vary slightly depending on the resources available where you run it.</p>
</blockquote>
<p>It is important to recognize in the performance results that <em>compiled</em> options are faster. As a general rule, you should <em>compile</em> any pointers you&#39;ll be using repeatedly.</p>

<a href="#releases" id="releases" style="color: inherit; text-decoration: none;">
  <h2>Releases</h2>
</a>
<ul>
<li><p>2021-05-14 — <strong>2.2.0</strong> <em>Added Handling for Relative JSON Pointers</em></p>
<ul>
<li><a href="https://github.com/flitbit/json-ptr/blob/487182100a08f4ddc7713e42ec063bbd5ce2c34c/examples/relative.js">Example usage</a></li>
</ul>
</li>
<li><p>2021-05-12 — <strong>2.1.1</strong> <em>Bug fix for <a href="https://github.com/flitbit/json-ptr/issues/36">#36</a></em></p>
<ul>
<li>@CarolynWebster reported an unintentional behavior change starting at v1.3.0. An operation involving a pointer/path that crossed a null value in the object graph resulted in an exception. In versions prior to v1.3.0 it returned <code>undefined</code> as intended. The original behavior has been restored.</li>
</ul>
</li>
<li><p>2021-05-12 — <strong>2.1.0</strong> <em>Bug fixes for <a href="https://github.com/flitbit/json-ptr/issues/28">#28</a> and <a href="https://github.com/flitbit/json-ptr/issues/30">#30</a>; <strong>Security Vulnerability Patched</strong></em></p>
<ul>
<li><p>When compiling the accessors for quickly points in an object graph, the <code>.get()</code> method was not properly delimiting single quotes. This error caused the get operation to throw an exception in during normal usage. Worse, in cases where malicious user input was sent directly to <code>json-ptr</code>, the failure to delimit single quotes allowed the execution of arbitrary code (an injection attack). The first of these issues was reported in #28 by @mprast, the second (vulnerability) by @zpbrent. Thanks also to @elimumford for the actual code used for the fix.</p>
</li>
<li><p>If your code sent un-sanitized user input to the <code>.get()</code> method of <code>json-ptr</code>, your project was susceptible to this security vulnerability!</p>
</li>
</ul>
</li>
<li><p>2020-10-21 — <strong>2.0.0</strong> <em><em>Breaking Change</em></em></p>
<ul>
<li>Prototype pollution using this library is now disallowed and will throw an error. I&#39;ve been looking into the origin of this issue and it seems to have been disclosed by mohan on <a href="https://www.huntr.dev/bounties/1-npm-json-ptr/">huntr.dev</a>. I received <a href="https://github.com/flitbit/json-ptr/pull/26">a PR from</a> <a href="https://github.com/luci-m-666">@luci-m-666</a>, but found <a href="https://github.com/418sec/json-ptr/pull/1">another PR</a> by <a href="https://github.com/alromh87">@alromh87</a> that looks like the origin of the solution. Don&#39;t know who to thank, but thanks all -- somebody is due a bounty.</li>
<li>Just in case somebody was relying on <code>json-ptr</code> to support pointers across the prototype, I&#39;m rolling the major version number because you&#39;re now broken.</li>
</ul>
</li>
</ul>
<blockquote>
<p>BEWARE of <a href="#user-content-where-did-the-global-functions-go">Breaking Changes at v1.3.0!</a></p>
</blockquote>
<ul>
<li><p>2020-07-20 — <strong>1.3.2</strong></p>
<ul>
<li>Added missing <code>tslib</code> dependency.</li>
<li>Documented <a href="#user-content-where-did-the-global-functions-go">where the global functions are now located; moving them broke compatibility at v1.3.0</a>.</li>
</ul>
</li>
<li><p>2020-07-10 — <strong>1.3.0</strong> <strong>BREAKING CHANGES</strong></p>
<ul>
<li><strong>BREAKING CHANGE:</strong> Global functions are now static functions on the <code>JsonPointer</code> type. See <a href="#user-content-where-did-the-global-functions-go"><em>Where did the Global Functions Go?</em></a></li>
<li>Merged new <code>.unset()</code> function contributed by @chrishalbert, updated dependencies.</li>
<li>Migrated to typescript and retooled build/test/deploy pipeline. Definitely typed.</li>
<li>100% test coverage which illuminated some idiosyncrasies; maybe we killed unobserved bugs, nobody knows.</li>
</ul>
</li>
<li><p>2019-09-14 — <strong>1.2.0</strong></p>
<ul>
<li>Merged new <code>.concat</code> function contributed by @vuwuv, updated dependencies.</li>
</ul>
</li>
<li><p>2019-03-10 — <strong>1.1.2</strong></p>
<ul>
<li>Updated packages to remove critical security concern among dev dependencies&#39;</li>
</ul>
</li>
<li><p>2016-07-26 — <strong>1.0.1</strong></p>
<ul>
<li>Fixed a problem with the Babel configuration</li>
</ul>
</li>
<li><p>2016-01-12 — <strong>1.0.0</strong></p>
<ul>
<li>Rolled major version to 1 to reflect breaking change in <code>.list(obj, fragmentId)</code>.</li>
</ul>
</li>
<li><p>2016-01-02 — <strong>0.3.0</strong></p>
<ul>
<li>Retooled for node 4+</li>
<li>Better compiled pointers</li>
<li>Unrolled recursive <code>.list</code> function</li>
<li>Added <code>.map</code> function</li>
<li>Fully linted</li>
<li>Lots more tests and examples.</li>
<li>Documented many previously undocumented features.</li>
</ul>
</li>
<li><p>2014-10-21 — <strong>0.2.0</strong> Added #list function to enumerate all properties in a graph, producing fragmentId/value pairs.</p>
</li>
</ul>

<a href="#license" id="license" style="color: inherit; text-decoration: none;">
  <h2>License</h2>
</a>
<p><a href="https://github.com/flitbit/json-ptr/blob/master/LICENSE">MIT</a></p>
</div></div><div class="col-4 col-menu menu-sticky-wrap menu-highlight"><nav class="tsd-navigation primary"><ul><li class="current"><a href="modules.html">Exports</a></li></ul></nav><nav class="tsd-navigation secondary menu-sticky"><ul><li class="tsd-kind-class"><a href="classes/JsonPointer.html" class="tsd-kind-icon">Json<wbr/>Pointer</a></li><li class="tsd-kind-class"><a href="classes/JsonReference.html" class="tsd-kind-icon">Json<wbr/>Reference</a></li><li class="tsd-kind-interface"><a href="interfaces/JsonStringPointerListItem.html" class="tsd-kind-icon">Json<wbr/>String<wbr/>Pointer<wbr/>List<wbr/>Item</a></li><li class="tsd-kind-interface"><a href="interfaces/UriFragmentIdentifierPointerListItem.html" class="tsd-kind-icon">Uri<wbr/>Fragment<wbr/>Identifier<wbr/>Pointer<wbr/>List<wbr/>Item</a></li><li class="tsd-kind-type-alias"><a href="modules.html#Decoder" class="tsd-kind-icon">Decoder</a></li><li class="tsd-kind-type-alias"><a href="modules.html#Dereference" class="tsd-kind-icon">Dereference</a></li><li class="tsd-kind-type-alias"><a href="modules.html#Encoder" class="tsd-kind-icon">Encoder</a></li><li class="tsd-kind-type-alias"><a href="modules.html#JsonStringPointer" class="tsd-kind-icon">Json<wbr/>String<wbr/>Pointer</a></li><li class="tsd-kind-type-alias"><a href="modules.html#PathSegment" class="tsd-kind-icon">Path<wbr/>Segment</a></li><li class="tsd-kind-type-alias"><a href="modules.html#PathSegments" class="tsd-kind-icon">Path<wbr/>Segments</a></li><li class="tsd-kind-type-alias"><a href="modules.html#Pointer" class="tsd-kind-icon">Pointer</a></li><li class="tsd-kind-type-alias"><a href="modules.html#RelativeJsonPointer" class="tsd-kind-icon">Relative<wbr/>Json<wbr/>Pointer</a></li><li class="tsd-kind-type-alias"><a href="modules.html#UriFragmentIdentifierPointer" class="tsd-kind-icon">Uri<wbr/>Fragment<wbr/>Identifier<wbr/>Pointer</a></li><li class="tsd-kind-type-alias"><a href="modules.html#Visitor" class="tsd-kind-icon">Visitor</a></li><li class="tsd-kind-function"><a href="modules.html#compilePointerDereference" class="tsd-kind-icon">compile<wbr/>Pointer<wbr/>Dereference</a></li><li class="tsd-kind-function"><a href="modules.html#decodeFragmentSegments" class="tsd-kind-icon">decode<wbr/>Fragment<wbr/>Segments</a></li><li class="tsd-kind-function"><a href="modules.html#decodePointer" class="tsd-kind-icon">decode<wbr/>Pointer</a></li><li class="tsd-kind-function"><a href="modules.html#decodePointerSegments" class="tsd-kind-icon">decode<wbr/>Pointer<wbr/>Segments</a></li><li class="tsd-kind-function"><a href="modules.html#decodePtrInit" class="tsd-kind-icon">decode<wbr/>Ptr<wbr/>Init</a></li><li class="tsd-kind-function"><a href="modules.html#decodeRelativePointer" class="tsd-kind-icon">decode<wbr/>Relative<wbr/>Pointer</a></li><li class="tsd-kind-function"><a href="modules.html#decodeUriFragmentIdentifier" class="tsd-kind-icon">decode<wbr/>Uri<wbr/>Fragment<wbr/>Identifier</a></li><li class="tsd-kind-function"><a href="modules.html#encodeFragmentSegments" class="tsd-kind-icon">encode<wbr/>Fragment<wbr/>Segments</a></li><li class="tsd-kind-function"><a href="modules.html#encodePointer" class="tsd-kind-icon">encode<wbr/>Pointer</a></li><li class="tsd-kind-function"><a href="modules.html#encodePointerSegments" class="tsd-kind-icon">encode<wbr/>Pointer<wbr/>Segments</a></li><li class="tsd-kind-function"><a href="modules.html#encodeUriFragmentIdentifier" class="tsd-kind-icon">encode<wbr/>Uri<wbr/>Fragment<wbr/>Identifier</a></li><li class="tsd-kind-function"><a href="modules.html#looksLikeFragment" class="tsd-kind-icon">looks<wbr/>Like<wbr/>Fragment</a></li><li class="tsd-kind-function"><a href="modules.html#pickDecoder" class="tsd-kind-icon">pick<wbr/>Decoder</a></li><li class="tsd-kind-function"><a href="modules.html#replace" class="tsd-kind-icon">replace</a></li><li class="tsd-kind-function"><a href="modules.html#setValueAtPath" class="tsd-kind-icon">set<wbr/>Value<wbr/>At<wbr/>Path</a></li><li class="tsd-kind-function"><a href="modules.html#toArrayIndexReference" class="tsd-kind-icon">to<wbr/>Array<wbr/>Index<wbr/>Reference</a></li><li class="tsd-kind-function"><a href="modules.html#unsetValueAtPath" class="tsd-kind-icon">unset<wbr/>Value<wbr/>At<wbr/>Path</a></li></ul></nav></div></div></div><footer class="with-border-bottom"><div class="container"><h2>Legend</h2><div class="tsd-legend-group"><ul class="tsd-legend"><li class="tsd-kind-constructor tsd-parent-kind-class"><span class="tsd-kind-icon">Constructor</span></li><li class="tsd-kind-property tsd-parent-kind-class"><span class="tsd-kind-icon">Property</span></li><li class="tsd-kind-method tsd-parent-kind-class"><span class="tsd-kind-icon">Method</span></li></ul><ul class="tsd-legend"><li class="tsd-kind-property tsd-parent-kind-interface"><span class="tsd-kind-icon">Property</span></li></ul><ul class="tsd-legend"><li class="tsd-kind-method tsd-parent-kind-class tsd-is-static"><span class="tsd-kind-icon">Static method</span></li></ul></div><h2>Settings</h2><p>Theme <select id="theme"><option value="os">OS</option><option value="light">Light</option><option value="dark">Dark</option></select></p></div></footer><div class="container tsd-generator"><p>Generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a></p></div><div class="overlay"></div><script src="assets/main.js"></script></body></html>
import{_ as a,b as n}from"./app.f6ac025a.js";const s={},e=n(`<h2 id="props" tabindex="-1"><a class="header-anchor" href="#props" aria-hidden="true">#</a> Props</h2><h4 id="steps" tabindex="-1"><a class="header-anchor" href="#steps" aria-hidden="true">#</a> steps</h4><ul><li>Type: <code>Array</code></li><li>Default: <code>required</code></li></ul><p>Your steps.</p><h4 id="stepindex" tabindex="-1"><a class="header-anchor" href="#stepindex" aria-hidden="true">#</a> stepIndex</h4><ul><li>Type: <code>Number</code></li><li>Default: <code>-1</code></li></ul><p>Current step index, use with &#39;v-model&#39; to sync.</p><h4 id="padding" tabindex="-1"><a class="header-anchor" href="#padding" aria-hidden="true">#</a> padding</h4><ul><li>Type: <code>Number</code></li><li>Default: <code>0</code></li></ul><p>Padding of the highlight.</p><h4 id="useoverlay" tabindex="-1"><a class="header-anchor" href="#useoverlay" aria-hidden="true">#</a> useOverlay</h4><ul><li>Type: <code>Boolean</code></li><li>Default: <code>true</code></li></ul><p>Show or hide overlay.</p><h4 id="pagination" tabindex="-1"><a class="header-anchor" href="#pagination" aria-hidden="true">#</a> pagination</h4><ul><li>Type: <code>Boolean</code></li><li>Default: <code>true</code></li></ul><p>Show or hide the pagination.</p><h4 id="closebtn" tabindex="-1"><a class="header-anchor" href="#closebtn" aria-hidden="true">#</a> closeBtn</h4><ul><li>Type: <code>Boolean</code></li><li>Default: <code>true</code></li></ul><p>Show or hide the close (x) btn.</p><h4 id="name" tabindex="-1"><a class="header-anchor" href="#name" aria-hidden="true">#</a> name</h4><ul><li>Type: <code>String</code></li><li>Default: <code>undefined</code></li></ul><p>Tour name if you want to use multiple tours.</p><h4 id="allowkeyboardevent" tabindex="-1"><a class="header-anchor" href="#allowkeyboardevent" aria-hidden="true">#</a> allowKeyboardEvent</h4><ul><li>Type: <code>Boolean</code></li><li>Default: <code>true</code></li></ul><p>Whether to allow keyboard events (left, right, Esc).</p><h4 id="allowescclose" tabindex="-1"><a class="header-anchor" href="#allowescclose" aria-hidden="true">#</a> allowEscClose</h4><ul><li>Type: <code>Boolean</code></li><li>Default: <code>true</code></li></ul><p>Whether to end the tour when pressing &#39;Esc&#39; key.</p><h4 id="allowoverlayclose" tabindex="-1"><a class="header-anchor" href="#allowoverlayclose" aria-hidden="true">#</a> allowOverlayClose</h4><ul><li>Type: <code>Boolean</code></li><li>Default: <code>true</code></li></ul><p>Whether to end the tour when clicking on the overlay.</p><h4 id="arrow" tabindex="-1"><a class="header-anchor" href="#arrow" aria-hidden="true">#</a> arrow</h4><ul><li>Type: <code>Boolean</code></li><li>Default: <code>true</code></li></ul><p>Show or hide popover arrow.</p><h4 id="offset" tabindex="-1"><a class="header-anchor" href="#offset" aria-hidden="true">#</a> offset</h4><ul><li>Type: <code>Number</code></li><li>Default: <code>0</code></li></ul><p>Popover distance from the target.</p><h4 id="position" tabindex="-1"><a class="header-anchor" href="#position" aria-hidden="true">#</a> position</h4><ul><li>Type: <code>String</code></li><li>Default: <code>bottom</code></li></ul><p>Popover position, can be: &#39;top&#39;, &#39;left&#39;, &#39;right&#39;, &#39;bottom&#39;.</p><h4 id="placement" tabindex="-1"><a class="header-anchor" href="#placement" aria-hidden="true">#</a> placement</h4><ul><li>Type: <code>String</code></li><li>Default: <code>start</code></li></ul><p>Popover placement, can be: &#39;start&#39;, &#39;center&#39;, &#39;end&#39;.</p><h4 id="autoadjust" tabindex="-1"><a class="header-anchor" href="#autoadjust" aria-hidden="true">#</a> autoAdjust</h4><ul><li>Type: <code>Boolean</code></li><li>Default: <code>true</code></li></ul><p>Whether to adjust popover to a new position if there is no space.</p><h2 id="step-properties" tabindex="-1"><a class="header-anchor" href="#step-properties" aria-hidden="true">#</a> Step Properties</h2><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token punctuation">{</span>
  <span class="token literal-property property">target</span><span class="token operator">:</span> <span class="token string">&#39;.step-1&#39;</span><span class="token punctuation">,</span> <span class="token comment">// Target selector</span>
  <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&#39;Hello world&#39;</span><span class="token punctuation">,</span> <span class="token comment">// Step title</span>
  <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;Step content&#39;</span><span class="token punctuation">,</span> <span class="token comment">// Step content</span>
  <span class="token literal-property property">padding</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">popover</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">position</span><span class="token operator">:</span> <span class="token string">&#39;bottom&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">placement</span><span class="token operator">:</span> <span class="token string">&#39;start&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">offset</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
    <span class="token literal-property property">arrow</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">autoAdjust</span><span class="token operator">:</span> <span class="token boolean">true</span>
    <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token string">&#39;hello-world&#39;</span><span class="token punctuation">,</span> <span class="token comment">// Used for aria-labelledby &amp; aria-describedby</span>
    <span class="token comment">// &#39;aria-label&#39;: &#39;Hello world&#39;, // When title is undefined</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>Property defined in step will overwrite what is defined in the props</p></div><h2 id="methods" tabindex="-1"><a class="header-anchor" href="#methods" aria-hidden="true">#</a> Methods</h2><h4 id="vgt-start-index" tabindex="-1"><a class="header-anchor" href="#vgt-start-index" aria-hidden="true">#</a> <code>$vgt.start(index)</code></h4><p>Start the tour from the index (default 0).</p><h4 id="vgt-next" tabindex="-1"><a class="header-anchor" href="#vgt-next" aria-hidden="true">#</a> <code>$vgt.next()</code></h4><p>Move on to the next step.</p><h4 id="vgt-prev" tabindex="-1"><a class="header-anchor" href="#vgt-prev" aria-hidden="true">#</a> <code>$vgt.prev()</code></h4><p>Move on to the prev step.</p><h4 id="vgt-end" tabindex="-1"><a class="header-anchor" href="#vgt-end" aria-hidden="true">#</a> <code>$vgt.end()</code></h4><p>End the tour.</p><h4 id="vgt-move-index" tabindex="-1"><a class="header-anchor" href="#vgt-move-index" aria-hidden="true">#</a> <code>$vgt.move(index)</code></h4><p>Move to a specific step.</p><h2 id="events" tabindex="-1"><a class="header-anchor" href="#events" aria-hidden="true">#</a> Events</h2><h4 id="after-start" tabindex="-1"><a class="header-anchor" href="#after-start" aria-hidden="true">#</a> <code>@after-start</code></h4><p>Emits after the tour start.</p><h4 id="after-end" tabindex="-1"><a class="header-anchor" href="#after-end" aria-hidden="true">#</a> <code>@after-end</code></h4><p>Emits after the tour end.</p><h4 id="after-move" tabindex="-1"><a class="header-anchor" href="#after-move" aria-hidden="true">#</a> <code>@after-move</code></h4><p>Emits after the tour move to the next or prev step.</p><h2 id="slots" tabindex="-1"><a class="header-anchor" href="#slots" aria-hidden="true">#</a> Slots</h2><p>The available slots: <code>#content</code>, <code>#close</code>, <code>#nav</code></p><div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>vue-guided-tour</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">#content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{ stepIndex }<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>step {{ stepIndex }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">#close</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>$vgt.end<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>x<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">#nav</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{ isFirstStep, isLastStep }<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>!isFirstStep<span class="token punctuation">&quot;</span></span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>$vgt.prev<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Prev<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>isLastStep<span class="token punctuation">&quot;</span></span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>$vgt.end<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>End<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">v-else</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>$vgt.next<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>Next<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>vue-guided-tour</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,70);function t(o,p){return e}var c=a(s,[["render",t],["__file","config.html.vue"]]);export{c as default};

Formatter = require '../src/lib/json_formatter.coffee'
formatter = new Formatter

minify = (str) ->
  str.replace(/(^\s*|\n)/gm, '')

suite 'JSONFormatter', ->

  suite '#htmlEncode', ->
    test 'null', ->
      assert.equal(formatter.htmlEncode(null), '')
    test 'normal string', ->
      assert.equal(formatter.htmlEncode('abcd'), 'abcd')
    test 'html string', ->
      assert.equal(formatter.htmlEncode('<"&>'), '&lt;&quot;&amp;&gt;')

  test '#jsString', ->
    assert.equal(formatter.jsString('string'), 'string')

  test 'decorateWithSpan', ->
    assert.equal(
      formatter.decorateWithSpan('value', 'class-name'),
      '<span class="class-name">value</span>'
    )

  test '#nullToHTML', ->
    assert.equal(formatter.nullToHTML(null), '<span class="null">null</span>')

  test '#numberToHTML', ->
    assert.equal(formatter.numberToHTML(1), '<span class="num">1</span>')

  suite '#stringToHTML', ->
    test 'normal string', ->
      assert.equal(formatter.stringToHTML('string'), '<span class="string">"string"</span>')
    test 'http url', ->
      assert.equal(
        formatter.stringToHTML('http://yesmeck.com'),
        minify """
        <a href="http://yesmeck.com">
          <span class="q">"</span>http://yesmeck.com<span class="q">"</span>
        </a>
        """
      )

  test '#booleanToHTML', ->
    assert.equal(formatter.booleanToHTML(true), '<span class="bool">true</span>')

  test '#arrayToHTML', ->
    assert.equal(
      formatter.valueToHTML([1]),
      minify """
      [
        <ul class="array level0">
          <li><span class="num">1</span></li>
        </ul>
      ]
      """
    )

  test '#objectToHTML', ->
    assert.equal(
      formatter.objectToHTML({a: 1}),
      minify """
      {
        <ul class="obj level0">
          <li>
            <a class="prop" href="javascript:;">
              <span class="q">"</span>a<span class="q">"</span>
            </a>: <span class="num">1</span>
          </li>
        </ul>
      }
      """
    )


  test 'level', ->
    assert.equal(
      formatter.objectToHTML({a: {b: 1}}),
      minify """
      {
        <ul class="obj level0">
          <li>
            <a class="prop" href="javascript:;">
              <span class="q">"</span>a<span class="q">"</span>
            </a>: {
              <ul class="obj level1 collapsible">
                <li>
                  <a class="prop" href="javascript:;">
                    <span class="q">"</span>b<span class="q">"</span>
                  </a>: <span class="num">1</span>
                </li>
              </ul>
            }
          </li>
        </ul>
      }
      """
    )

  test 'multiline string', ->
    formatter = new Formatter(nl2br: true)
    assert.equal(
      formatter.stringToHTML("line1\nline2\nline3"),
      minify """
      <span class="string multiline">
        "line1
        <br />
        line2
        <br />
        line3"
      </span>
      """
    )

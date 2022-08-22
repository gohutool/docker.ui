class Collapser
  @bindEvent: (item, options) ->
    item.firstChild.addEventListener('click', (event) =>
      @toggle(event.target.parentNode.firstChild, options)
    )
    collapser = document.createElement('div')
    collapser.className = 'collapser'
    collapser.innerHTML = if options.collapsed then '+' else '-'
    collapser.addEventListener('click', (event) =>
      @toggle(event.target, options)
    )
    item.insertBefore(collapser, item.firstChild)
    @collapse(collapser) if options.collapsed

  @expand: (collapser) ->
    target = @collapseTarget(collapser)
    return if target.style.display == ''
    ellipsis = target.parentNode.getElementsByClassName('ellipsis')[0]
    target.parentNode.removeChild(ellipsis)
    target.style.display = ''
    collapser.innerHTML = '-'

  @collapse: (collapser) ->
    target = @collapseTarget(collapser)
    return if target.style.display == 'none'
    target.style.display = 'none'
    ellipsis = document.createElement('span')
    ellipsis.className = 'ellipsis'
    ellipsis.innerHTML = ' &hellip; '
    target.parentNode.insertBefore(ellipsis, target)
    collapser.innerHTML = '+'

  @toggle: (collapser, options = {}) ->
    target = @collapseTarget(collapser)
    action = if target.style.display == 'none' then 'expand' else 'collapse'
    if options.recursive_collapser
      collapsers = collapser.parentNode.getElementsByClassName('collapser')
      for collapser in collapsers
        @[action](collapser)
    else
      @[action](collapser)

  @collapseTarget: (collapser) ->
    targets = collapser.parentNode.getElementsByClassName('collapsible')
    return unless targets.length
    target = targets[0]


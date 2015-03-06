      computeLegendLayout: (svg, series, dimensions) ->
        padding = 10
        that = this

        leftWidths = this.getLegendItemsWidths(svg, 'y')

        leftLayout = [0]
        i = 1
        while i < leftWidths.length
          leftLayout.push(leftWidths[i-1] + leftLayout[i - 1] + padding)
          i++


        rightWidths = this.getLegendItemsWidths(svg, 'y2')
        return [leftLayout] unless rightWidths.length > 0

        w = dimensions.width - dimensions.right - dimensions.left

        cumul = 0
        rightLayout = []
        j = rightWidths.length - 1
        while j >= 0
          rightLayout.push w  - cumul - rightWidths[j]
          cumul += rightWidths[j] + padding
          j--

        rightLayout.reverse()

        return [leftLayout, rightLayout]

      getLegendItemsWidths: (svg, axis) ->
        that = this
        bbox = (t) -> that.getTextBBox(t).width

        items = svg.selectAll(".legendItem.#{axis}")
        return [] unless items.length > 0

        widths = []
        i = 0
        while i < items[0].length
          widths.push(bbox(items[0][i]))
          i++

        return widths

      drawLegend: (svg, series, dimensions, handlers) ->
        that = this
        legend = svg.append('g').attr('class', 'legend')

        d = 16
        svg.select('defs').append('svg:clipPath')
          .attr('id', 'legend-clip')
          .append('circle').attr('r', d/2)

        item = legend.selectAll('.legendItem')
          .data(series)

        items = item.enter().append('g')
            .attr(
              'class': (s, i) -> "legendItem series_#{i} #{s.axis}"
              'opacity': (s, i) ->
                if s.visible is false
                  that.toggleSeries(svg, i)
                  return '0.2'

                return '1'
            )

        item.on('click', (s, i) ->
          handlers.onSeriesVisibilityChange?({
            series: s,
            index: i,
            newVisibility: !(s.visible isnt false)
          })
        )

        item.append('circle')
          .attr(
            'fill': (s) -> s.color
            'stroke': (s) -> s.color
            'stroke-width': '2px'
            'r': d/2
          )

        item.append('path')
          .attr(
            'clip-path': 'url(#legend-clip)'
            'fill-opacity': (s) -> if s.type in ['area', 'column'] then '1' else '0'
            'fill': 'white'
            'stroke': 'white'
            'stroke-width': '2px'
            'd': (s) -> that.getLegendItemPath(s, d, d)
          )

        item.append('circle')
          .attr(
            'fill-opacity': 0
            'stroke': (s) -> s.color
            'stroke-width': '2px'
            'r': d/2
          )


        item.append('text')
          .attr(
            'class': (d, i) -> "legendText series_#{i}"
            'font-family': 'Courier'
            'font-size': 10
            'transform': 'translate(13, 4)'
            'text-rendering': 'geometric-precision'
          )
          .text (s) -> s.label || s.y


        [left, right] = this.computeLegendLayout(svg, series, dimensions)
        items.attr(
          'transform': (s, i) ->
            if s.axis is 'y'
              return "translate(#{left.shift()},#{dimensions.height-40})"
            else
              return "translate(#{right.shift()},#{dimensions.height-40})"
        )

        return this

      getLegendItemPath: (series, w, h) ->
        if series.type is 'column'
          path = 'M' + (-w/3) + ' ' + (-h/8) + ' l0 ' + h + ' '
          path += 'M0' + ' ' + (-h/3) + ' l0 ' + h + ' '
          path += 'M' + w/3 + ' ' + (-h/10) + ' l0 ' + h + ' '

          return path

        base_path = 'M-' + w/2 + ' 0' + h/3 + ' l' + w/3 + ' -' + h/3 + ' l' + w/3 + ' ' +  h/3 + ' l' + w/3 + ' -' + 2*h/3

        base_path + ' l0 ' + h + ' l-' + w + ' 0z' if series.type is 'area'

        return base_path

      toggleSeries: (svg, index) ->
        isVisible = false

        svg.select('.content').selectAll('.series_' + index)
          .style('display', (s) ->
            if d3.select(this).style('display') is 'none'
              isVisible = true
              return 'initial'
            else
              isVisible = false
              return 'none'
          )

        return isVisible

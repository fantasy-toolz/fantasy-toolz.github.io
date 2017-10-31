var data = [
  {"year": 2004,    "sbs": 2589},
  {"year": 2005,    "sbs": 2565},
  {"year": 2006,    "sbs": 2767},
  {"year": 2007,    "sbs": 2918},
  {"year": 2008,    "sbs": 2799},
  {"year": 2009,    "sbs": 2970},
  {"year": 2010,    "sbs": 2959},
  {"year": 2011,    "sbs": 3279},
  {"year": 2012,    "sbs": 3229},
  {"year": 2013,    "sbs": 2693},
  {"year": 2014,    "sbs": 2764},
    {"year": 2015,    "sbs": 2505},
    {"year": 2016,    "sbs": 2537},
      {"year": 2017,    "sbs": 2527}
]

var f = d3.f

//var sel = d3.select('body').html('')
var sel = d3.select("#chart").html('')//append("svg")
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: sel.node().offsetWidth, 
  height: 400, 
  margin: {left: 50, right: 50, top: 30, bottom: 30}
})

c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

c.x.domain([2005, 2018])
c.y.domain([2400, 3300])

c.xAxis.ticks(4).tickFormat(f())
c.yAxis.ticks(5).tickFormat(d => d)

var area = d3.area().x(f('year', c.x)).y0(f('sbs', c.y)).y1(c.height)
var line = d3.area().x(f('year', c.x)).y(f('sbs', c.y))

var clipRect = c.svg
  .append('clipPath#clip')
  .append('rect')
  .at({width: c.x(2010) - 2, height: c.height})

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip)')

correctSel.append('path.area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path.your-line')

d3.drawAxis(c)


yourData = data
  .map(function(d){ return {year: d.year, sbs: d.sbs, defined: 0} })
  .filter(function(d){
    if (d.year == 2010) d.defined = true
    return d.year >= 2010
  })

var completed = false

var drag = d3.drag()
  .on('drag', function(){
    var pos = d3.mouse(this)
    var year = clamp(2011, 2018, c.x.invert(pos[0]))
    var sbs = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.sbs = sbs
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(f('defined'))(yourData)})

    if (!completed && d3.mean(yourData, f('defined')) == 1){
      completed = true
      clipRect.transition().duration(1000).attr('width', c.x(2017))
    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }

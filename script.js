
//set up width and height
const width =1300;
const height =  800;
margin = {top: 20, right: 20, bottom: 40, left: 100}

const plot = d3.select("#pop");


const svg= plot.append("svg")
    .attr("width",  width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


var malePromise =  d3.csv('./data/malePopRe.csv')
var femalePromise =  d3.csv('./data/femalePopRe.csv')

Promise.all([malePromise, femalePromise]).then(function([male, female]){


    // filteredMale = male.filter(function(d){ return d.year == 1950 });
    // filteredFemale = female.filter(function(d){ return d.year == 1950 });



    // console.log(filteredMale);

    // const allAge = filteredMale.map(function(d) {
    //     return d.age_Group;
    // });



    // X axis for female data

    let x2 = d3.scaleLinear()
    .domain([0, d3.max(female, d => +d.population)]).nice()
    .range([0, width / 2]);

    let x2a= d3.scaleLinear()
    .domain([d3.max(female, d => +d.population),0]).nice()
    .range([0, width / 2]);

    // Add X axis
    let x = d3.scaleLinear()
    .domain([0, d3.max(male, d => +d.population)]).nice()
    .range([0, width / 2]);

    svg.append("g")
    .attr("transform", "translate("+(width/2+ margin.left) +"," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");


    // Y axis
    var y = d3.scaleBand()
    .domain(male.map(d => d.age_Group))
    .range([ 0, height])
    .padding(.1);


    let maleg= svg.append('g')
    .attr("transform", "translate("+(width/2+ margin.left) +"," + 0 + ")");

    let femaleg= svg.append('g')
    .attr("transform", "translate(" + (width/2+ margin.left) + "," + 0 + ")");

    let year = 1950;
    d3.interval(() => {
        update(year);
        year += 5;
        if (year > 1985) year = 1950; // loop back to start
    }, 1500);

    svg.append("g")
    .attr("transform", "translate(" +margin.left + "," + height + ")")
    .call(d3.axisBottom(x2a))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    
        svg.append("g")
        .attr("transform", "translate("+margin.left +"," + 0 + ")")
        .call(d3.axisLeft(y))


    // Append a text element to display the year
let yearLabel = svg.append("text")
.attr("class", "yearLabel")
.attr("x", width -100)
.attr("y", height-100)
.attr("text-anchor", "middle")
.attr("font-size", "24px");

    function update(year) {
        let filteredMale = male.filter(d => d.year == year);
        let filteredFemale = female.filter(d => d.year == year);
    

        yearLabel.text(year);

        maleg.selectAll("rect")
            .data(filteredMale, d => d.age_Group)
            .join(
                enter => enter.append("rect")
                    .attr("y", d => y(d.age_Group))
                    .attr("height", y.bandwidth())
                    .attr("fill", "#3DACEB"),
                update => update,
                exit => exit.remove()
            )
            .transition()
            .duration(1000)
            .attr("x", 0)
            .attr("width", d => x(+d.population))
            .attr("height", y.bandwidth())
            .attr("fill", "#3DACEB");
    
        femaleg.selectAll("rect")
            .data(filteredFemale, d => d.age_Group)
            .join(
                enter => enter.append("rect")
                    .attr("y", d => y(d.age_Group))
                    .attr("height", y.bandwidth())
                    .attr("fill", "#ef8a62"),
                update => update,
                exit => exit.remove()
            )
            .transition()
            .duration(1000)
            .attr("x", d => -x2(+d.population))
            .attr("width", d => x2(+d.population))
            .attr("height", y.bandwidth())
            .attr("fill", "#ef8a62");
    }
    
    
})
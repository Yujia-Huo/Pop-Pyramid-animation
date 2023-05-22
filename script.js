
//set up width and height
const width =1300;
const height =  800;
margin = {top: 30, right: 20, bottom: 40, left: 100}

const plot = d3.select("#pop");


const svg= plot.append("svg")
    .attr("width",  width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


var malePromise =  d3.csv('./data/malePop_present.csv')
var femalePromise =  d3.csv('./data/femalePop_present.csv')
var maleProPromise =  d3.csv('./data/malePop_projected.csv')
var femaleProPromise =  d3.csv('./data/femalePop_projected.csv')

Promise.all([malePromise, femalePromise, maleProPromise, femaleProPromise]).then(function([male, female, malep, femalep]){


    // filteredMale = male.filter(function(d){ return d.year == 1950 });
    // filteredFemale = female.filter(function(d){ return d.year == 1950 });



    // console.log(filteredMale);

    // const allAge = filteredMale.map(function(d) {
    //     return d.age_Group;
    // });



    // X axis for female data

    let x2 = d3.scaleLinear()
    .domain([0, d3.max(femalep, d => +d.population)]).nice()
    .range([0, width / 2]);

    let x2a= d3.scaleLinear()
    .domain([d3.max(malep, d => +d.population),0]).nice()
    .range([0, width / 2]);

    // Add X axis
    let x = d3.scaleLinear()
    .domain([0, d3.max(malep, d => +d.population)]).nice()
    .range([0, width / 2]);

    svg.append("g")
    .attr("transform", "translate("+(width/2+ margin.left+17) +"," + (height+margin.top) + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");


    // Y axis
    var y = d3.scaleBand()
    .domain(male.map(d => d.age_Group))
    .range([ 0, height])
    .padding(.1);




    let malepG= svg.append('g')
    .attr("transform", "translate("+(width/2+ margin.left+17) +"," + margin.top + ")");

    let femalepG= svg.append('g')
    .attr("transform", "translate(" + (width/2+ margin.left-17) + "," + margin.top + ")");
    
    let maleg= svg.append('g')
    .attr("transform", "translate("+(width/2+ margin.left+17) +"," + margin.top + ")");

    let femaleg= svg.append('g')
    .attr("transform", "translate(" + (width/2+ margin.left-17) + "," + margin.top + ")");

    let year = 1950;
    let year2 = 1950;
    d3.interval(() => {
        yearLabel.text(year2);
        update2(year2);
        update(year);
        year += 5;
        year2 += 5;
        // yearLabel.text(year2);
        if (year > 2020)year = 2020; 
        if (year2 > 2100)year2 = 2100;// loop back to start
    }, 1500);

    svg.append("g")
    .attr("transform", "translate(" +(margin.left-17) + "," + (height+margin.top) + ")")
    .call(d3.axisBottom(x2a))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");


    svg.append("g")
    .attr("transform", "translate("+ (width / 2+ margin.left+16) +"," + (margin.top-15) + ")") // move to middle of chart
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove()) // remove axis line
    .call(g => g.selectAll(".tick line").remove()) // remove tick lines
    .selectAll("text")
    .style("text-anchor", "middle") // center the labels
    .attr("dx", "-.8em") // additional shift, adjust this value as per requirement
    .attr("dy", y.bandwidth()/2); // align in the middle of the band


    // Append a text element to display the year
    let yearLabel = svg.append("text")
    .attr("class", "yearLabel")
    .attr("x",100)
    .attr("y", 100)
    .attr("text-anchor", "middle")
    .attr("font-size", "24px");

    function update(year) {
        let filteredMale = male.filter(d => d.year == year);
        let filteredFemale = female.filter(d => d.year == year);
    

        // yearLabel.text(year);

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


    function update2(year) {
        let filteredMalep = malep.filter(d => d.year == year);
        let filteredFemalep = femalep.filter(d => d.year == year);
    

        // yearLabel.text(year);


            // If projected data is available, update projected bars
        malepG.selectAll("rect")
            .data(filteredMalep, d => d.age_Group)
            .join(
                enter => enter.append("rect")
                    .attr("y", d => y(d.age_Group))
                    .attr("height", y.bandwidth())
                    .attr("fill", "green")
                    .attr("opacity", 0.5),
                update => update,
                exit => exit.remove()
            )
            .transition()
            .duration(1000)
            .attr("x", 0)
            .attr("width", d => x(+d.population))
            .attr("height", y.bandwidth())
            .attr("fill", "green")
            .attr("opacity", 0.5);
    
        femalepG.selectAll("rect")
            .data(filteredFemalep, d => d.age_Group)
            .join(
                enter => enter.append("rect")
                    .attr("y", d => y(d.age_Group))
                    .attr("height", y.bandwidth())
                    .attr("fill", "red")
                    .attr("opacity", 0.5),
                update => update,
                exit => exit.remove()
            )
            .transition()
            .duration(1000)
            .attr("x", d => -x2(+d.population))
            .attr("width", d => x2(+d.population))
            .attr("height", y.bandwidth())
            .attr("fill", "red")
            .attr("opacity", 0.5);
        
    }

    
    
})
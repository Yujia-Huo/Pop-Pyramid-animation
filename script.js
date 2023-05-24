
//set up width and height
const width =1300;
const height =  800;
margin = {top: 70, right: 20, bottom: 60, left: 100}


//create canvas
const plot = d3.select("#pop");
const legend = d3.select("#legend");

const svg= plot.append("svg")
    .attr("width",  width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

const svg2=legend.append('svg')
    .attr("width",  300)
    .attr("height", height + margin.top + margin.bottom)


//load data
var malePromise =  d3.csv('./data/malePop_present.csv')
var femalePromise =  d3.csv('./data/femalePop_present.csv')
var maleProPromise =  d3.csv('./data/malePop_projected.csv')
var femaleProPromise =  d3.csv('./data/femalePop_projected.csv')

Promise.all([malePromise, femalePromise, maleProPromise, femaleProPromise]).then(function([male, female, malep, femalep]){

    //legend components
    let maleColor = svg2.append('rect')
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "#2F989D");

    let maleColorP = svg2.append('rect')
        .attr("x", 10)
        .attr("y", 50)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "#78D2D6");

    let femaleColorP = svg2.append('rect')
        .attr("x", 10)
        .attr("y", 130)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "#FF928F");


    let femaleColor = svg2.append('rect')
        .attr("x", 10)
        .attr("y", 90)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "#FF514C");

    let maleLabel = svg2.append("text")
        .text('Male')
        .attr("class", "popLabel")
        .attr("x", 60)
        .attr("y", 23)
        .attr("text-anchor", "left")
        .attr("font-size", "15px");


    let malePLabel = svg2.append("text")
        .text('Male Projected (after 2020)')
        .attr("class", "popLabel")
        .attr("x", 60)
        .attr("y", 23+40)
        .attr("text-anchor", "left")
        .attr("font-size", "15px");


    let femaleLabel = svg2.append("text")
        .text('Female')
        .attr("class", "popLabel")
        .attr("x", 60)
        .attr("y", 23+40+40)
        .attr("text-anchor", "left")
        .attr("font-size", "15px");

    let femalePLabel = svg2.append("text")
        .text('Female Projected (after 2020)')
        .attr("class", "popLabel")
        .attr("x", 60)
        .attr("y", 23+40+40+40)
        .attr("text-anchor", "left")
        .attr("font-size", "15px");
    


    //x scales

    let x2 = d3.scaleLinear()
    .domain([0, d3.max(malep, d => +d.population)]).nice()
    .range([0, width / 2]);

    let x2a= d3.scaleLinear()
    .domain([d3.max(malep, d => +d.population),0]).nice()
    .range([0, width / 2]);

    let x = d3.scaleLinear()
    .domain([0, d3.max(malep, d => +d.population)]).nice()
    .range([0, width / 2]);


    //male x axis
    svg.append("g")
    .attr("transform", "translate("+(width/2+ margin.left+17) +"," + (height+margin.top) + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("class", "axis-label")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");


    // Y scale
    var y = d3.scaleBand()
    .domain(male.map(d => d.age_Group))
    .range([ height, 0])
    .padding(.1);


    //g for bars

    let malepG= svg.append('g')
    .attr("transform", "translate("+(width/2+ margin.left+17) +"," + margin.top + ")");

    let femalepG= svg.append('g')
    .attr("transform", "translate(" + (width/2+ margin.left-17) + "," + margin.top + ")");
    
    let maleg= svg.append('g')
    .attr("transform", "translate("+(width/2+ margin.left+17) +"," + margin.top + ")");

    let femaleg= svg.append('g')
    .attr("transform", "translate(" + (width/2+ margin.left-17) + "," + margin.top + ")");


    //loop for animation
    let year = 1950;
    let year2 = 1950;
    let yearElement = d3.select("#year");
    d3.interval(() => {
        yearElement.text(year2);
        update2(year2);
        update(year);
        year += 5;
        year2 += 5;
        if (year > 2020)year = 2020; 
        if (year2 > 2100)year2 = 2100;// loop back to start
    }, 1500);

    //female x axis
    svg.append("g")
    .attr("transform", "translate(" +(margin.left-17) + "," + (height+margin.top) + ")")
    .call(d3.axisBottom(x2a))
    .selectAll("text")
        .attr("class", "axis-label")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");


    //Y axis
    svg.append("g")
    .attr("transform", "translate("+ (width / 2+ margin.left+16) +"," + (margin.top-15) + ")") // move to middle of chart
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove()) // remove axis line
    .call(g => g.selectAll(".tick line").remove()) // remove tick lines
    .selectAll("text")
    .attr("class", "axis-label")
    .style("text-anchor", "middle") // center the labels
    .attr("dx", "-.8em") // additional shift, adjust this value as per requirement
    .attr("dy", y.bandwidth()/2); // align in the middle of the band

    //axis label
    let popLabel = svg.append("text")
    .text('Population (in thousands)')
    .attr("class", "popLabel")
    .attr("x",margin.left+70)
    .attr("y", height+margin.top-20)
    .attr("text-anchor", "middle")
    .attr("font-size", "15px");

    let ageLabel = svg.append("text")
    .text('Age Group')
    .attr("class", "ageLabel")
    .attr("x",width / 2+ margin.left)
    .attr("y", margin.top-20)
    .attr("text-anchor", "middle")
    .attr("font-size", "15px");

    //display years
    let yearLabel = svg.append("text")
    .attr("class", "yearLabel")
    .attr("x",width)
    .attr("y", height+20)
    .attr("text-anchor", "middle")
    .attr("font-size", "30px");


    //function draw the pre 2020 bars
    function update(year) {

        //filter data
        let filteredMale = male.filter(d => d.year == year);
        let filteredFemale = female.filter(d => d.year == year);
    
        //draw and updates
        maleg.selectAll("rect")
            .data(filteredMale, d => d.age_Group)
            .join(
                enter => enter.append("rect")
                    .attr("y", d => y(d.age_Group))
                    .attr("height", y.bandwidth())
                    .attr("fill", "#2F989D"),
                update => update,
                exit => exit.remove()
            )
            .transition()
            .duration(1000)
            .attr("x", 0)
            .attr("width", d => x(+d.population))
            .attr("height", y.bandwidth())
            .attr("fill", "#2F989D");
    
        femaleg.selectAll("rect")
            .data(filteredFemale, d => d.age_Group)
            .join(
                enter => enter.append("rect")
                    .attr("y", d => y(d.age_Group))
                    .attr("height", y.bandwidth())
                    .attr("fill", "#FF514C"),
                update => update,
                exit => exit.remove()
            )
            .transition()
            .duration(1000)
            .attr("x", d => -x2(+d.population))
            .attr("width", d => x2(+d.population))
            .attr("height", y.bandwidth())
            .attr("fill", "#FF514C");        
    }



    //function draw the after 2020 bars
    function update2(year) {

        //filter data
        let filteredMalep = malep.filter(d => d.year == year);
        let filteredFemalep = femalep.filter(d => d.year == year);
    

        //draw and updates
        malepG.selectAll("rect")
            .data(filteredMalep, d => d.age_Group)
            .join(
                enter => enter.append("rect")
                    .attr("y", d => y(d.age_Group))
                    .attr("height", y.bandwidth())
                    .attr("fill", "#78D2D6")
                    .attr("opacity", 1),
                update => update,
                exit => exit.remove()
            )
            .transition()
            .duration(1000)
            .attr("x", 0)
            .attr("width", d => x(+d.population))
            .attr("height", y.bandwidth())
            .attr("fill", "#78D2D6")
            .attr("opacity", 1);
    
        femalepG.selectAll("rect")
            .data(filteredFemalep, d => d.age_Group)
            .join(
                enter => enter.append("rect")
                    .attr("y", d => y(d.age_Group))
                    .attr("height", y.bandwidth())
                    .attr("fill", "#FF928F")
                    .attr("opacity", 1),
                update => update,
                exit => exit.remove()
            )
            .transition()
            .duration(1000)
            .attr("x", d => -x2(+d.population))
            .attr("width", d => x2(+d.population))
            .attr("height", y.bandwidth())
            .attr("fill", "#FF928F")
            .attr("opacity", 1);
        
    }

    
    
})
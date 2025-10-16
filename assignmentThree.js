
async function fetchData() {
  const data = await d3.csv("./dataset/videogames_wide.csv");
  return data;
}

//---------------------------------

fetchData().then(async (data) => {


  const vlSpec = vl
    .markRect()
    .data(data)
    .encode(
        vl.y().fieldN("Platform").sort("-x"),
        vl.x().fieldN("Genre").title("Genre"),
        vl.color().fieldQ("Global_Sales").aggregate("sum").title("Global Sales (Millions)"),
        vl.tooltip([
      vl.fieldN("Platform"),
      vl.fieldN("Genre"),
      { field: "Global_Sales", type: "quantitative", aggregate: "sum", title: "Sales (Millions)" }
        ])
    )
    .width(400)
    .height(400)
    .toSpec();

   const vlSpec2 = vl
     .markArea()
     .data(data)
     .encode(
        vl.x().fieldT("Year").sort("-x"),
        vl.y().fieldQ("Global_Sales").aggregate("sum").title("Global Sales (Millions)").stack("center"),
        vl.color().fieldN("Genre"),
        vl.row().fieldN("Platform"),
        vl.tooltip([
      { field: "Year", type: "temporal", format:"%Y" },
      vl.fieldN("Genre"),
      { field: "Global_Sales", type: "quantitative", aggregate: "sum", title: "Sales (Millions)" }
        ])
     )
     .width(400)
     .height(400)
     .resolve({
        scale: { x: "independent" },
        axis: { x: "independent" }
    })
     .toSpec();

const vlSpec3 = vl
    .markBar()
    .data(data)
    .transform([
        {
            "fold": ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"],
            "as": ["Region", "Regional_Sales"]
        },
        {
            "filter": "datum.Regional_Sales > 0"
        }
    ])
    .encode(

        vl.y().fieldN("Platform").sort({ 
            op: "sum", 
            field: "Regional_Sales", 
            order: "descending" 
        }), 
        vl.x().fieldQ("Regional_Sales").aggregate("sum").title("Total Sales (Millions)").stack("zero"), 
        vl.color().fieldN("Region"),
        vl.tooltip([
      vl.fieldN("Platform"),
      vl.fieldN("Region"),
      { field: "Regional_Sales", type: "quantitative", aggregate: "sum", title: "Sales (Millions)" }
        ])
    )
    .width(400)
    .height(400)
    .toSpec();

const vlSpec4 = vl
    .markArea()
    .data(data)
    .transform([
        {
            filter: 'datum.Platform === "PS2"'
        }
    ])
    .encode(
        vl.y().fieldQ("Global_Sales").aggregate("sum").stack("zero").title("Global Sales (Millions)"),
        vl.x().fieldT("Year"),
        vl.color().fieldN("Genre"),
        vl.tooltip([
      vl.fieldN("Genre"),
      { field: "Year", type: "temporal", format:"%Y" },
      { field: "Global_Sales", type: "quantitative", aggregate: "sum", title: "Sales (Millions)" }
        ])
    )
    .width(600)
    .height(400)
    .toSpec();  

  render("#vis1", vlSpec)
  render("#vis2Genre", vlSpec2)
  render("#vis3", vlSpec3)
  render("#vis4", vlSpec4)
});


//---------------------------------
async function render(viewID, spec) {
  const result = await vegaEmbed(viewID, spec);
  result.view.run();
}
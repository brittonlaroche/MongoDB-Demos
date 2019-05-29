Note this tutorial build's on the [Employee Tutorial](../employee)

## Tutorial Contents 
1. [MongoDB blog tutorial](https://docs.mongodb.com/stitch/tutorials/blog-overview/)
2. [Atlas Triggers and Functions: Employee tutorial](https://github.com/brittonlaroche/MongoDB-Demos/edit/master/Stitch/employee/)
3. [Stitch Query Anywhere tutorial](https://github.com/brittonlaroche/MongoDB-Demos/edit/master/Stitch/rest)
4. [Atlas Charts tutorial](https://github.com/brittonlaroche/MongoDB-Demos/edit/master/Stitch/charts)

## Atlas Charts Overview
In this short tutorial we are going to build some atlas charts on our employee data created in our HR application.  Once the charts are created we will embed them in our employee application.  Creating charts is very easy, it does not require any code, you can drag and drop fields and apply functions such as sum and count to create stunning charts in a matter of minutes.

![Diagram](img/atlascharts.jpg "Diagram")

### 1. Create a new Atlas Dashboard
Log in to atlas from https://cloud.mongodb.com. Create a new stitch Atlas Dashboard by selecting "Charts" from the left menu pain. 
![Chart Menu](img/achart1.jpg "Chart Menu")

After selecting the chart menu item a new charts window will open in your browser, press the "New Dashboard" button.
![New Dashboard](img/achart2.jpg "New Dashboard")

Give the new dashboard a name and description
![Dashboard Name](img/achart3.jpg "Name the Dashboard")

### 2. Create a new Atlas Chart
After the dashboard is created, click the "Add Chart" button. Next you have to select a datasource for the chart. 
![Datasource](img/achart4.jpg "Choose a Datasource")

Select the HR.employees collection we created in the [Atlas Triggers and Functions: Employee tutorial](https://github.com/brittonlaroche/MongoDB-Demos/edit/master/Stitch/employee/) 

![Datasource Employees](img/achart4.jpg "Employees Datasource")

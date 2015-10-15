# WPS for the preliminary comparison of OSM and authoritative road network datasets
This folder contains the code to setup the Web Processing Service (WPS) for a preliminary comparison of the OpenStreetMap (OSM) and authoritative (hereafter REF) road network datasets. This corresponds to the Step 1 of the procedure described in the folder [GRASS-scripts](https://github.com/MoniaMolinari/OSM-roads-comparison/tree/master/GRASS-scripts).
In brief, the WPS allows to import customized road datasets from OSM and an authoritative source and returns some measures of their spatial similarity in a PDF file.

## Live demo
A demo of the WPS is available [here](http://131.175.143.84/WPS/).

## How to use the tool
Road network datasets must (for REF) and can (for OSM) be uploaded as a compressed ESRI shapfile. Click the *Browse* button, select the .zip file from your system and adjust its color using the *Layer Color* selector. You have also to enter the reference system of the dataset.

The OSM road network dataset can be also retrieved using the [Overpass API](http://wiki.openstreetmap.org/wiki/Overpass_API) by clicking the *Retrieve OSM* data button. This will retrieve OSM data for the current map view; alternatively, hold down the shift key, draw a rectangle on the map view and then click the *Selection Retrieve* button.

When at least two datasets have been uploaded, click the *Compare* menu button.  
This will open a menu where you can specify the buffer width for the comparison, the datasets to be used as REF and OSM and (optionally) the mask for clipping the previous datasets - to be previously uploaded again as a compressed ESRI shapefile. Then click the *Start* comparison button to run the algorithm and download some statistics on the similarity between the datasets in a PDF file.

## Installation
To start using the tool it is required to insert the GRASS script in its location:
```sh
/usr/lib/grass/script
```

Then for PyWPS we need as well the Python process, located in:
```sh
/usr/local/wps/processes
```

## Running
To ensure the process to work we have to set some locations in our scripts.  
Inside the file `osm.py` at line `14` you have to define a GRASS location that must already have been created by GRASS:
```
 grassLocation ="/home/user/grassdata/location"
```
In the `v.osm.precomp` at line `71` you should define the location of the HOME folder:
```
os.environ['HOME'] = "/home/user/"
```
and then at line `191` the Python location inside GRASS: 
```
sys.path.append("/usr/lib/grass70/etc/python/")
```

## External Resources 
### Dependencies
* [GRASS GIS 7] [grass]  
* [Python] [python]  
* [PyWPS] [pywps]  
* [OGRE] [ogre]  


### Libraries
* [OpenLayers 3](http://openlayers.org/en/v3.4.0/examples)  
* [jQuery](https://jquery.com/)  
* [pdf.js](https://github.com/mozilla/pdf.js.git)  
* [FileSaver.js](https://github.com/eligrey/FileSaver.js.git)

[grass]: <https://grass.osgeo.org/grass7/>
[pap1]: <http://geomatica.como.polimi.it/workbooks/n12/FOSS4G-eu15_submission_70.pdf>
[ogre]: <http://ogre.adc4gis.com/>
[python]: <https://www.python.org/>
[pywps]: <http://pywps.wald.intevation.org/>

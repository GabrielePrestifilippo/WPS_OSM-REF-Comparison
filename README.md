# WPS_OSM-REF-Comparison
Comparison of OpenStreetMap (OSM) with authoritative road datasets (REF).  
The procedure allows to import customized road datasets from the OSM database and an authoritative source and returns some measures of their spatial similarity.

## Authors
>Maria Antonia Brovelli  
>Marco Minghini  
>Monia Elisa Molinari   
>Peter Mooney  
>Gabriele Prestifilippo  

## Publication
  [Academic Publishing] [pap1]


## How to use the tool
Road network datasets must (for REF) and can (for OSM) be uploaded as a compressed ESRI shapfile.   Click the Browse button, select the .zip file from your system and adjust its color using the Layer Color selector. Enter also the reference system of the dataset.

The OSM road network dataset can be also retrieved (using the Overpass API) by clicking the Retrieve OSM data button. This will retrieve OSM data for the current map view; alternatively, hold down the shift key to select a rectangle on the map view and then click the Selection Retrieve button.

When at least two datasets have been uploaded, click the Compare menu button.  
This will open a menu where you can specify the buffer width for the comparison, the datasets to be used as REF and OSM and (optionally) the mask for clipping the previous datasets - to be previously uploaded as a compressed shapefile. Then click the Start comparison button to run the algorithm and download some statistics on the similarity between the datasets in a PDF file.

## Installation
To start using the tool is required to insert the GRASS script in its location
```sh
/usr/lib/grass/script
```

Then for PyWPS we need as well the python process, located in 
```sh
/usr/local/wps/processes
```
## Running
To ensure the process to work we have to set some location in our scripts.  
Inside the file `osm.py` in the line `14` we have to define a GRASS location that was already created by grass.
```
 grassLocation ="/home/user/grassdata/location"
```
In the `v.osm.precomp` we should define in the line `71` the location of HOME folder
```
os.environ['HOME'] = "/home/user/"
```
and then the python location inside grass, in the line `191`
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

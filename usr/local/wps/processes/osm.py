from pywps.Process import WPSProcess
import types
import logging
class Process(WPSProcess):
     def __init__(self):
          # init process
         WPSProcess.__init__(self,
              identifier = "osm",
              title="GIS_precomp",
              version = "0.1",
              storeSupported = "true",
              statusSupported = "true",
              abstract="Compare 2 vectors from input",
              grassLocation ="/home/user/grassdata/location")

    
	 
         self.dbtr = self.addComplexInput(identifier="input1",title="Input vector data 1",formats =[{'mimeType':'text/xml'}])
	 self.osm = self.addComplexInput(identifier="input2",title="Input vector data 2",formats =[{'mimeType':'text/xml'}])

	 self.mask = self.addComplexInput(identifier="mask",title="Mask to restrict the area", minOccurs=0, formats =[{'mimeType':'text/xml'}])

	 self.buffer = self.addLiteralInput(identifier = "buffer",
                                            title = "Buffer size",
                                            type = type(""),
                                            default="15")


	 self.Output=self.addLiteralOutput(identifier="output",title="result")

	 

         

     def execute(self):

      
        refLayer=self.dbtr.getValue()
        osmLayer=self.osm.getValue()
	
	bufferSize=self.buffer.getValue()

	mask = None

	try:
	    mask=self.mask.getValue()
	    
	    logging.warning("Mask found");
	    logging.warning(mask)
	except NameError:
	    logging.warning("No mask found");
	    
	logging.warning("Layer:");
	logging.warning(refLayer);
	logging.warning(osmLayer);
	logging.warning(mask);
	if mask is not None:
		res=self.cmd(["v.osm.precomp", "osm="+osmLayer, "ref="+refLayer, "roi="+mask, "buffer="+bufferSize])
        else:
		res=self.cmd(["v.osm.precomp", "osm="+osmLayer, "ref="+refLayer, "buffer="+bufferSize])
        
	self.Output.setValue(res)
	

        return

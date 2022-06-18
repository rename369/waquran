<?php
	// config
	error_reporting(0);
	$folder 		= 1;

    while ($folder <= 114) {

	    $output 		= "rekap_ayat.txt";
	    $konten_semua 	= glob($folder."/*.txt");

	    $konten_judul 		= file_get_contents($folder."/name.txt");
	    $konten_judul_latin	= file_get_contents($folder."/name.latin.txt");

	    $ayat_nomor		= 1;

    	foreach($konten_semua as $file) {
	    	if ($file != $folder.'/name.txt' && $file != $folder.'/name.latin.txt') {
		        
		        $konten_body = file_get_contents($file);
		        
		        $konten_fix = $folder."|".$ayat_nomor."|".trim($konten_judul)."|".trim($konten_judul_latin)."|".$konten_body;
		        echo $konten_fix.'<br>';

		    	$ayat_nomor++;
		    }

	        file_put_contents($output, PHP_EOL . $konten_fix, FILE_APPEND);
	    }
    	$folder++;
    }

?>
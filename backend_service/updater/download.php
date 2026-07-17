<?php
	ob_end_clean();

	$size = 0;
	$files = bzdecompress($_POST['files']);
	if (is_string($files) === FALSE)
		$files = $_POST['files'];

	foreach (explode(';', $files) as $val)
	{
		$f = trim(str_replace('\\', '/', $val));
		if (substr_compare($f, '.bz2', strlen($f) - 4) === 0 && file_exists($f))
			$size += filesize($f);
		else
		{
			echo "Missing $val";
			exit;
		}
	}

	$start = 0;
	if (isset($_POST['start']))
		$start = intval($_POST['start']);

	header('Content-Description: File-Transfer');
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename="data.bin"');
	header('Expires: 0');
	header('Cache-Control: must-revalidate');
	header('Pragma: public');
	header('Content-Length: '. ($size - $start));

	foreach (explode(';', $files) as $val)
	{
		$val = trim(str_replace('\\', '/', $val));
		if ($start >= filesize($val))
			$start = $start - filesize($val);
		else if ($start > 0)
		{
			$f = fopen(str_replace('\\', '/', $val), 'rb') or die("Cannot open $val");
			rewind($f) or die("Cannot rewind $val");
			fseek($f, $start) == 0 or die("Cannot seek in $val");
			while (!feof($f))
				echo fread($f, 8*1024);
			fclose($f);
			$start = 0;
		}
		else
			readfile(str_replace('\\', '/', $val));
	}
	exit;
?>
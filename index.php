<!DOCTYPE html>
<html>
<head>
	<title>Fun Times</title>
	<link rel="icon" href="images/smiley.png">
	
	<!-- external files -->
	<link rel="stylesheet" type="text/css" href="stylesheet.css">
	<script type="text/javascript" src=""></script>
</head>
<body>
	<div class = "dividerLine"></div>
	<div id = "contentBox">
		<div class = "canvas">
			<div class = "pixel"></div>
			<?php
				for ($x = 0; $x <= 10; $x++){
					echo "The number is: $x <br>";
				}
			?>
		</div>
	</div>
	<div class = "dividerLine"></div>
</body>
</html>
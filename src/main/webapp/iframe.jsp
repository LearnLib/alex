<!Doctype html>
<html>
	<head>
		<script>
		</script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<style>
			*, *:after, *:before {
				box-sizing: border-box;
			}
			body {
				margin: 0;
				width: 100%;
				overflow-x: hidden;
			}
			#layer-iframe {
				position: absolute;
				top: 44px;
				bottom: 0;
				width: 100%;
				z-index: 10;
				overflow: hidden;
			}
			#iframe {
				max-width: 100% !important;
				max-heigth: 100% !important;
				margin: 0;
				padding: 0;
				position: absolute;
				top: 0;
				border: none;
				bottom: 0;
			}
			#layer-tools {
				position: absolute;
				z-index: 20;
			}
			#topbar {
				position: fixed;
				top: 0;
				z-index: 30;
				height: 44px;
				width: 100%;
				background: green;
				border-bottom: 2px solid #000;
			}
		</style>
	</head>
	<body>
		<div id="layer-iframe">
			<iframe id="iframe"></iframe>
		</div>
		
		<div id="layer-tools">
			<div id="topbar">
				<form id="newUrl" method="get">
					<input type="text" id="url" placeholder="http://google.de" />
					<input type="submit" value="Seite laden" />
				</form>
				<button id="toggleUserInteractions">User Interactions: off</button>
			</div>
		</div>
		
		<script>
				
			var proxyUrl = 'http://127.0.0.1:8080/weblearner/rest/proxy/?url=';
			var allowIframeInteractions = false;
			
			// adjust iframe size to window size
			var iframe = $('#iframe');
			iframe.css({
				width: $(window).width() + 'px',
				height: ($(window).height() - 44) + 'px'
			});
			
			// handle iframe interactions
			$('#toggleUserInteractions').click(function(){
				allowIframeInteractions = allowIframeInteractions == false ? true : false;
				$(this).text('User Interactions: ' + (allowIframeInteractions ? 'on' : 'off'));
			})
		
			// handle url load
			$('#newUrl').submit(function(){
			
				var urlToLoad = $('#url').val();
				if (urlToLoad == '')
					return false;
										
				// load url from proxy
				iframe.attr( 'src', proxyUrl + escape(urlToLoad) );
				
				// wait for iframe to load content
				iframe.get(0).onload = function(){
					
					// since url is loaded from proxy,
					// iframe has no cross domain limitations and can be modified
					
					// prevent clicks on links
					iframe.contents().find('a').on('click', function(e){
					
						// highlight clicked links
						$(this).css({
							'border' : '2px solid red',
						})
						
						if (!allowIframeInteractions) {
							// prevent default click behaviour on links
							e.preventDefault();
							
							// apply own behaviour
						}
					});
					
					// prevent form submits
					iframe.contents().find('form').submit(function(e){
						
						if (!allowIframeInteractions){
							e.preventDefault();
						}
					})
				}
			
				return false;
			});
			
		</script>
		
	</body>
</html>
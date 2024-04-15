Manual
Para la creacion del servidor he utilizado el programa pycharm utilizando el lenguaje de programación python. He necesitado añadir algunas librerias para su correcto funcionamiento.
Estas librerías han sido:
colorpy==0.1.1
flask-restx==1.0.3
Flask-Cors & Flask
mypy-extensions==0.4.3
matplotlib & numpy
pandas & json5
tmm==0.1.8
selenium

En cuanto a la estructura del proyecto, dentro de la carpeta tfgColors se encuentran dos carpetas, api_color y web_client.
En la carpeta api_color se encuentra creado el servidor, dentro del src existen varias carpetas, la carpeta calculo_color contiene las clases con la logica interna del servidor y la carpeta rest contiene la api que lanza al servidor. Ademas existe la carpeta test1 donde se encuentran las pruebas unitarias utilizando unittest y las pruebas de interfaz utilizando selenium. Todo el código de la parte del servidor se ha realizado en el lenguaje de programación python.

En la carpeta web_client se encuentran los tres ficheros encargados de generar el cliente, el fichero index.html contiene el código html de la creación de la pagina web del cliente. El fichero script.js contiene la funcionalidad del cliente en el lenguaje javascript y el fichero style.css contiene el estilo de la web del cliente.
 
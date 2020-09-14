This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Para arrancar la APP

* clonar repositorio
* entrar en la carpeta table-vanilla
* necesario levantar con un server local, por ejemplo abriendo el codigo con Visual Studio Code y haciendo uso de "Live Server"


### Funcionalidad tabla

* La tabla muestra una serie de filas correspondientes a un archivo JSON que el componente recibe como fuente de datos
* Está pensada para que funcione con json de gran tamaño. No renderiza todos los elementos, sólo los veinte primeros y si hacemos scroll hasta la parte baja de la barra renderiza otros 20 añadiéndolos a los existentes
* Se puede elegir el lenguaje, se ha hecho un proveedor de traducciones básico que sirva para toda la APP. Si fuera una SPA con varias páginas usará los mismos recursos para hacer las traducciones en todas las páginas. Por eso la funcionalidad del mismo se encuentra en App.js.
* En el caso de la grabación muestra un icono en lugar de un texto dependiendo de si su valor es true o false
* La tabla se puede ordenar por cualquier columna pulsando sobre el header de la columna. Si se vuelve a pulsar ordena en sentido inverso y si se vuelve a pulsar deja la tabla
en el estado original.
* Se pueden agrupar los elementos por árbol de primer nivel. La tabla aparece ordenada y se puede ver los elementos pulsando en el icono "+" si se quieren replegar volveríamos  a pulsar "+".

### Refactorizaciones posibles
* Para identificar la fila que queremos desplegar se usa una id basada en el contenido que coincide en las celdas agrupadas. Pero ha resultado inadecuada ya que para columnas donde la información es larga como text no es fácil de implementar. Y en otras exige sustituir ciertos caracteres para funcionar (Función "mountIdentifier"). Para evitar esto y dado que las columans agrupadas están ordenadas, se podría utilizar un sistema de índice para indicar mejor qué fila se ha pedido desplegar en el click.
* Añadir iconos en las cabeceras de las columnas que indiquen si las filas están agrupadas por esa cabecera y en qué dirección. En el momento que se pulsa una para ordenar crearíamos una función que buscaría la id de la cabecera y añadiría el icono correspondiente.
* Que el icono de desplegar un grupo cambie a "-"
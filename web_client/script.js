
function agregarFilaDebajo(row) {
  const tableBody = document.getElementById('table-body');
  const newRow = document.createElement('tr');

  // Obtén el número de capa actual
  let layerNumber = 1;
  const currentRow = row;

  // Verifica si la celda de la capa actual contiene un número antes de realizar la suma
  const currentLayerCell = currentRow.querySelector('td:first-child');
  if (currentLayerCell && !isNaN(parseInt(currentLayerCell.textContent))) {
    layerNumber = parseInt(currentLayerCell.textContent)+1;
  }

  // Crea la celda para la columna "Layer"
  const layerCell = document.createElement('td');
  layerCell.textContent = layerNumber;
  newRow.appendChild(layerCell);
  const materialCell = document.createElement('td');
  const materialSelect = document.createElement('select');
  materialCell.appendChild(materialSelect);
  newRow.appendChild(materialCell);

  // Columna "Thickness" como campo de entrada
  const thicknessCell = document.createElement('td');
  const thicknessInput = document.createElement('input');
  thicknessInput.type = 'text';
  thicknessInput.placeholder = 'input thickness';
  thicknessCell.appendChild(thicknessInput);
  newRow.appendChild(thicknessCell);

  // Botones de acción //eliminar
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.textContent = '✕';
  deleteButton.onclick = function() {
    eliminarFila(newRow);
  };
  //añadir nueva fila
  const addRowButton = document.createElement('button');
  addRowButton.className = 'add-row-button';
  addRowButton.textContent = '+';
  addRowButton.onclick = function() {
    agregarFilaDebajo(newRow);
  };

  // Celda de acciones y botones
  const actionsCell = document.createElement('td');
  actionsCell.appendChild(deleteButton);
  actionsCell.appendChild(addRowButton);
  newRow.appendChild(actionsCell);

  // Determinar dónde agregar la nueva fila
  const nextRow = row.nextSibling;
  if (nextRow) {
    tableBody.insertBefore(newRow, nextRow);
  } else {
    tableBody.appendChild(newRow);
  }
  actualizarNumerosDeCapa(tableBody, newRow, layerNumber + 1);
  cargarMateriales(materialSelect);

}

function actualizarNumerosDeCapa(tableBody, startingRow) {
  const rowsToUpdate = Array.from(tableBody.children).slice(
    Array.from(tableBody.children).indexOf(startingRow)
  );

  let startingLayerNumber = parseInt(startingRow.querySelector('td:first-child').textContent);

  for (const rowToUpdate of rowsToUpdate) {
    const layerCell = rowToUpdate.querySelector('td:first-child');
    if (layerCell && !isNaN(parseInt(layerCell.textContent))) {
      layerCell.textContent = startingLayerNumber;
      startingLayerNumber++;
    }
  }
}


function eliminarFila(row) {
  var tableBody = document.getElementById('table-body');

  // Obtener el número de capa de la fila actual
  var layerNumber = parseInt(row.cells[0].textContent, 10);

  // Verificar que el número de capa es un entero
  if (!isNaN(layerNumber)) {
      // Eliminar la fila
      tableBody.removeChild(row);

      // Actualizar los números de capa de las filas posteriores
      var filasPosteriores = tableBody.getElementsByTagName('tr');
      for (var i = layerNumber; i < filasPosteriores.length; i++) {
          // Obtener el valor actual de la capa
          var currentLayer = filasPosteriores[i].cells[0].textContent;

          // Verificar que el valor actual de la capa sea un entero antes de modificarlo
          if (!isNaN(parseInt(currentLayer, 10))) {
              filasPosteriores[i].cells[0].textContent = i;
          }
      }
  } else {
      alert('No se puede actualizar el número de capa para un valor no numérico.');
  }
}



function cargarMateriales(selectElement) {
  // Realizar la solicitud al servidor
  fetch('http://localhost:5000/getMateriales/label')
    .then(response => response.json())
    .then(data => {
      // Obtener el elemento select del DOM
      //const select = document.getElementById('materiales');

      selectElement.innerHTML = '';

      // Iterar sobre los materiales y agregar cada uno al desplegable
      data.forEach(material => {
        const option = document.createElement('option');
        option.value = material;
        option.textContent = material;
        selectElement.appendChild(option);
      });
    })
    .catch(error => console.error('Error al cargar materiales:', error));
}

function obtenerColores() {
  const resultadoJsonDiv = document.getElementById('resultado-json');

  // Obtener todas las filas de la tabla
  const filas = document.querySelectorAll('#table-body tr');

  // Arrays para almacenar materiales y grosores
  const materialesArray = [];
  const grosoresArray = [];

  filas.forEach((fila, index) => {
    // Ignorar la primera fila
    if (index === 0 ){
      
      return;  // Saltar al siguiente ciclo
    }

    // Obtener el material de la fila
    const materialSelect = fila.querySelector('select');
    const materialSeleccionado = materialSelect ? materialSelect.value : 'si';
    materialesArray.push(materialSeleccionado);
    const grosorInput = fila.querySelector('input[type="text"]');
    const grosorIngresado = grosorInput ? (grosorInput.value.trim() === '' ? 2000 : grosorInput.value) : 2000;
    grosoresArray.push(grosorIngresado);
    
    if (index === filas.length - 1) {
      return false; // Terminar el bucle forEach
    }
    
  });

  // Hacer la solicitud al servidor con los valores obtenidos
  fetch(`http://localhost:5000/getColors/${materialesArray.join(',')}/${grosoresArray.join(',')}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Crear un formato personalizado para mostrar el objeto JSON
      let formattedResult = '';
      for (const key in data) {
        formattedResult += `${key}: ${data[key]}\n`;
      }

      // Mostrar los datos en formato personalizado en la interfaz
      resultadoJsonDiv.textContent = formattedResult;
      const rgbValues = data.rgb;
      mostrarColorRGB(rgbValues);


    })
    .catch(error => {
      console.error('Error al obtener colores:', error);
      // Manejar el error si es necesario
      resultadoJsonDiv.textContent = 'Error al obtener colores';
    });
}

function mostrarColorRGB(rgb) {
  // Obtener el elemento div donde se mostrará el color
  const colorDiv = document.getElementById('color-div');

  // Verificar si el elemento div existe
  if (colorDiv) {
    // Crear una cadena de estilo CSS con las coordenadas RGB
    const colorStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

    // Establecer el color de fondo del div
    colorDiv.style.backgroundColor = colorStyle;
  } else {
    console.error('Elemento div no encontrado.');
  }
}




// Llamar a la función para cargar los materiales al cargar la página



// Ejecutar la función al cargar la página o en algún evento
document.addEventListener('DOMContentLoaded', function() {
  const addButton = document.getElementById('add-row-button');
  const mostrarColoresButton = document.getElementById('mostrar-colores-button');
  const firstSelect = document.getElementById('materiales');

  if (addButton) {
  addButton.onclick = function() {
    const tableBody = document.getElementById('table-body');
    const firstRow = tableBody.children[0];
    agregarFilaDebajo(firstRow);
  
  }
  
};
  cargarMateriales(firstSelect);
   mostrarColoresButton.onclick = obtenerColores;
  

  
});

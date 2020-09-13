const listElm = document.querySelector('#infinite-list');
let data
let originalData
let groupedData
let groupedDataBy = 'ungroup'
let nextItem = 0
let orderKey
let orderDirection = 'disordered'

const mountHeader = () => {
  const tableHeader = document.querySelector('#table-header')
  tableConfig.columns.forEach(element => {
    let columnHeader = document.createElement('th');
    columnHeader.innerText = element.translation
    columnHeader.className = `th-${element.name}`
    columnHeader.addEventListener('click', () => orderBy(element.name))
    tableHeader.appendChild(columnHeader)
  })
}

const mountTableBody = (data) => {
  const tableBody = document.querySelector('#table-body')
  for (let i = 0; i < 20; i++) {
    let newRow = document.createElement('tr');
    tableConfig.columns.forEach(column => {
      const tableElement = document.createElement('td')
      let text
      if (column.name === 'date') {
        text = data[nextItem].calldate.split(' ')[0]
      } else if (column.name === 'hour') {
        text = data[nextItem].calldate.split(' ')[1]
      } else if (column.name === 'hasrecord') {
        if (data[nextItem].hasrecord === true) {
          text = 'icon'
        } else {
          text = ''
        }
      } else text = data[nextItem][column.name] || ''
      if (text !== 'icon') {
        tableElement.innerText = text
      } else {
        const iconChild = document.createElement('i')
        iconChild.className = 'fas fa-file-video'
        tableElement.appendChild(iconChild)
      }
      newRow.appendChild(tableElement)
      nextItem = nextItem + 1
    })
    tableBody.appendChild(newRow)
  }
}

const mountIdentifier = (value => {
  if (typeof value === 'number') {
    return value.toString()
  } else if (typeof value === 'string') {
    const regex = / /gi
      const regex2 = /\(/gi
      const regex3 = /\)/gi
      const regex4 = /\:/gi
      const value1 = value.replace(regex, '-')
      const value2 = value1.replace(regex2, '')
      const value3 = value2.replace(regex3, '-')
      return value3.replace(regex4, '')
  }
})

const displayButtonClicked = (target) => {
  const rowToDisplay = document.querySelector(`#tr-${target.currentTarget.className}`)
  if (rowToDisplay.nextElementSibling.cells.length !== 11){
    const dataToDisplay = groupedData.filter(element => mountIdentifier(element.groupName.toString()) === target.currentTarget.className)[0].rows
    dataToDisplay.forEach(row => {
      let newRow = document.createElement('tr')
      newRow.className = `tr-child-${target.currentTarget.className}`
      tableConfig.columns.forEach(column => {
        const tableElement = document.createElement('td')
        let text
        if (column.name === 'date') {
          text = row.calldate.split(' ')[0]
        } else if (column.name === 'hour') {
          text = row.calldate.split(' ')[1]
        } else if (column.name === 'hasrecord') {
          if (row.hasrecord === true) {
            text = 'icon'
          } else {
            text = ''
          }
        } else text = row[column.name] || ''
        if (text !== 'icon') {
          tableElement.innerText = text
        } else {
          const iconChild = document.createElement('i')
          iconChild.className = 'fas fa-file-video'
          tableElement.appendChild(iconChild)
        }
        newRow.appendChild(tableElement)
        nextItem = nextItem + 1
      })
      rowToDisplay.insertAdjacentElement("afterend", newRow)
    })
  } else {
    
    const dataToDisplay = groupedData.filter(element => mountIdentifier(element.groupName.toString()) === target.currentTarget.className)[0].rows
    dataToDisplay.forEach(row => {
      const toDelete = document.querySelector(`.tr-child-${target.currentTarget.className}`)
      const padre = toDelete.parentNode;
		  padre.removeChild(toDelete);
    })
  }
}


const mountTableBodyGrouped = (dataGrouped) => {
  const tableBody = document.querySelector('#table-body')
  for (let i = 0; i < 20; i++) {
    let newRow = document.createElement('tr')
    const identifier = mountIdentifier(dataGrouped[nextItem].groupName)
    newRow.id = `tr-${identifier}`
    const columnOrderBy = document.createElement('td')
    columnOrderBy.innerText = dataGrouped[nextItem].groupName + ': ' + dataGrouped[nextItem].numberOfElements + ' elem.'
    newRow.appendChild(columnOrderBy)
    const buttonColumn = document.createElement('td')
    const displayButton = document.createElement('button')
    displayButton.className = identifier
    displayButton.onclick = displayButtonClicked
    const iconChild = document.createElement('i')
    iconChild.className = 'fas fa-plus'
    displayButton.appendChild(iconChild)
    buttonColumn.appendChild(displayButton)
    newRow.appendChild(buttonColumn)
    nextItem = nextItem + 1
    tableBody.appendChild(newRow)
  }
}

const mountGroupOptions = () => {
  const groupSelect = document.querySelector('#groupBy')
  let ungroupOption = document.createElement('option')
  ungroupOption.value = 'ungroup'
  ungroupOption.innerText = 'ungroup'
  groupSelect.appendChild(ungroupOption)
  tableConfig.columns.forEach(element => {
    if (element.name !== 'note' && element.name !== 'typing' && element.name !== 'poll') {
      let groupOption = document.createElement('option')
      groupOption.value = element.name
      groupOption.innerText = element.name
      groupSelect.appendChild(groupOption)
    }
  })
}

const languageChanged = () => {
  const languageSelect = document.querySelector('#languages').value
  tableConfig.columns.forEach(column => {
    const text = languageSelect === 'english' ? column.name : column.translation
    let columnHeader = document.querySelector(`.th-${column.name}`)
    columnHeader.innerText = text
  })

}

const orderBy = (name) => {
  if (orderDirection === 'disordered') {
    orderDirection = 'asc'
    orderKey = name
  } else if (orderDirection === 'asc' && name === orderKey) {
    orderDirection = 'desc'
  } else if (orderDirection === 'desc' && name === orderKey) {
    orderDirection = 'disordered'
  } else {
    orderDirection = 'asc'
    orderKey = name
  }

  if (orderDirection === 'asc') {
    data = [...data.sort((a, b) => {
      if (name !== 'hour' && name !== 'date') {
        valueA = a[name]
        valueB = b[name]
      } else if (name === 'date') {
        valueA = a.calldate.split(' ')[0]
        valueB = b.calldate.split(' ')[0]
      } else {
        valueA = a.calldate.split(' ')[1]
        valueB = b.calldate.split(' ')[1]
      }
      if (valueA > valueB) {
        return 1;
      }
      if (valueA < valueB) {
        return -1;
      }
      return 0;
    })]
  } else if (orderDirection === 'desc') {
    data = [...data.sort((a, b) => {
      if (name !== 'hour' && name !== 'date') {
        valueA = a[name]
        valueB = b[name]
      } else if (name === 'date') {
        valueA = a.calldate.split(' ')[0]
        valueB = b.calldate.split(' ')[0]
      } else {
        valueA = a.calldate.split(' ')[1]
        valueB = b.calldate.split(' ')[1]
      }
      if (valueA < valueB) {
        return 1;
      }
      if (valueA > valueB) {
        return -1;
      }
      return 0;
    })]
  } else data = [...originalData]
  const tableBody = document.querySelector('#table-body')
  tableBody.innerHTML = ''
  nextItem = 0
  mountTableBody(data)
}

const groupByChanged = () => {
  groupedDataBy = document.querySelector('#groupBy').value
  if (groupedDataBy === 'ungroup') {
    const tableBody = document.querySelector('#table-body')
    tableBody.innerHTML = ''
    nextItem = 0
    mountTableBody(originalData)
  } else {
    const orderedData = [...originalData.sort((a, b) => {
      if (groupedDataBy !== 'hour' && groupedDataBy !== 'date') {
        valueA = a[groupedDataBy]
        valueB = b[groupedDataBy]
      } else if (groupedDataBy === 'date') {
        valueA = a.calldate.split(' ')[0]
        valueB = b.calldate.split(' ')[0]
      } else {
        valueA = a.calldate.split(' ')[1]
        valueB = b.calldate.split(' ')[1]
      }
      if (valueA > valueB) {
        return 1;
      }
      if (valueA < valueB) {
        return -1;
      }
      return 0;
    })]
    const alreadygrouped = []
    groupedData = []
    let rowValue
    orderedData.forEach((row) => {
      if (groupedDataBy === 'date') {
        rowValue = row.calldate.split(' ')[0]
      } else if (groupedDataBy === 'hour') {
        rowValue = row.calldate.split(' ')[1]
      } else if (groupedDataBy === 'hasrecord'){
        rowValue = row.hasrecord ? 'has record' : 'no has record'
      } else {
        rowValue = row[groupedDataBy]
      }
      if (
        !alreadygrouped.some(
          (alreadyGroupedBy) => alreadyGroupedBy === rowValue
        )
      ) {
        alreadygrouped.push(rowValue)
        let filtered
        if (groupedDataBy === 'date') {
          filtered = orderedData.filter(
            (element) => element.calldate.split(' ')[0] === rowValue
          )
        } else if (groupedDataBy === 'hour') {
          filtered = orderedData.filter(
            (element) => element.calldate.split(' ')[1] === rowValue
          )
        } else if (groupedDataBy === 'hasrecord') {
          const compare = rowValue === 'has record' ? true : false
          filtered = orderedData.filter(
            (element) => element[groupedDataBy] === compare
          )
        } else {
          filtered = orderedData.filter(
            (element) => element[groupedDataBy] === rowValue
          )
        }

        groupedData = [
          ...groupedData,
          {
            groupName: rowValue,
            numberOfElements: filtered.length,
            rows: [...filtered],
          },
        ]
      }
    })
    const tableBody = document.querySelector('#table-body')
    tableBody.innerHTML = ''
    nextItem = 0
    mountTableBodyGrouped(groupedData)
  }
}

const initTable = () => {
  fetch('./exerciceUITable.json')
    .then(response => response.json())
    .then(response => {
      data = [...response];
      originalData = [...response]
      mountTableBody(data);
    })
}

listElm.addEventListener('scroll', function () {
  if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
    if (groupedDataBy === 'ungroup') {
      mountTableBody(data);
    } else {
      mountTableBodyGrouped(groupedData);
    }
  }
});

mountGroupOptions();
mountHeader();
initTable();


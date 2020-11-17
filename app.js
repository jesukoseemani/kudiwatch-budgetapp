//storage controller
// const storageCtrl = (function(){

// return{
// storeItem: function(budget,type){
// if(type === "exp"){
// let exps;
// if(localStorage.getItem("expense") === null){

//   exps = [];

//   exps.push(budget)

//   localStorage.setItem("expense", JSON.stringify(exps))

// }else{
   
//   exps = JSON.parse(localStorage.getItem("expense"))

//   exps.push(budget)

//   localStorage.setItem("expense", JSON.stringify(exps))
  
// }
// }
// },

// storeItemI: function(budget,type){
//   if(type === "inc"){
//     let incs;
//     if(localStorage.getItem("income") === null){
    
//       incs = [];
    
//       incs.push(budget)
    
//       localStorage.setItem("income", JSON.stringify(incs))
    
//     }else{
       
//       incs = JSON.parse(localStorage.getItem("income"))
    
//       incs.push(budget)
    
//       localStorage.setItem("income", JSON.stringify(incs))
      
//     }
//   }
// },
// // storeIncItem: function(){

// // },
// getItem: function(){
  
//     let exps;
//     if(localStorage.getItem("expense") === null){
    
//       exps = [];
    
//     }else{
       
//       exps = JSON.parse(localStorage.getItem("expense"))
      
//     }
//     return exps
//   },

//   getItemI: function(){
//     let incs;
//     if(localStorage.getItem("income") === null){
    
//       incs = [];
    
//     }else{
       
//       incs = JSON.parse(localStorage.getItem("income"))
      
//     }
//     return incs

//   },
// // getIncItem: function(){

// // },
// deleteItem: function(id){
// let items = JSON.parse(localStorage.getItem("expense"))

// items.forEach(function(item){
//   if(id === item.id){
// items.splice(index,1)
//   }
// })

// localStorage.setItem("expense",JSON.stringify(items))
// },
// deleteItemI: function(id){
//   let items = JSON.parse(localStorage.getItem("income"))
  
//   items.forEach(function(item){
//     if(id === item.id){
//   items.splice(index,1)
//     }
//   })
//   localStorage.setItem("income",JSON.stringify(items))
//   }



// }

// })();






//budget controller

const budgetCtrl = (function(){

  const income = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;
   };

   const expense = function(id,description,value){
     this.id = id;
     this.description = description;
     this.value = value;
    };

    const calculateBudget = function(type){
      let total = 0;
  
      data.allItems[type].forEach(function(item){
        
        total += item.value;
  
      })
  
      data.total[type] = total;
  
    };

    

   //data structure
   const data = {
       allItems:{
         exp: [],
         inc: []
       },
       total: {
         exp: 0,
         inc: 0
       },
       totalBudget: 0,
       percentage: -1

   }


return{
  populateData: function(){
    return data.allItems;
  },
  addBudgetInTheCtrl:function(type,description,value){
    let ID, newItem

    if(data.allItems[type].length > 0){
     ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
    }else{
      ID = 0;
    }

    value = parseInt(value);

     if(type === "exp"){
       newItem = new expense(ID,description,value)
     }else if(type === "inc"){
       newItem = new income(ID,description,value)
     }

     data.allItems[type].push(newItem);
     
     return newItem;
  },
  
  getBudget: function(){
  
  calculateBudget("exp");
  calculateBudget("inc");

  data.totalBudget = data.total.inc - data.total.exp
 
  if(data.total.inc > 0){
    data.percentage = Math.round((data.total.exp / data.total.inc) * 100)
  }else{
    data.percentage = -1
  };

  return {
    totalInc: data.total.inc,
    totalExp: data.total.exp,
    totalBudget: data.totalBudget,
    totalPercentage: data.percentage

  }
  
},
getPercent: function(){
  let percent = 0;
  data.allItems.exp.forEach(function(item){
    if(data.total.inc > 0){
      percent = Math.round((item.value / data.total.inc) * 100);
    }else{
      percent = 0
    }
  

  })

  return percent

},
deleteInTheCtrl: function(id,type){
 
  // data.allItems[type].forEach(function(item,index){
  //    if(id === item.id){
    
  //     data.allItems[type].splice(index,1)

  //    }
  const ids = data.allItems[type].map(function(item){
      return item.id
  })

  const index = ids.indexOf(id)

  data.allItems[type].splice(index, 1)


},
  
  logData: function(){
   return data;
 }

}
  
})();

//UI controller
const UICtrl = (function(){

  const DOMselectors = {
    addButton: ".input-link",
    deleteButton: ".edit",
    expenseUL: ".expense--list",
    incomeUL: ".income--list",
    typeValue: ".select",
    inputName: "#input-text",
    inputValue: "#input-number",
    expenseTotal: ".budget__expense--amount",
    incometotal: ".budget__income--amount",
    total: ".budget__amount",
    tPercentage: "#percentageAll",
    percentage: "#percentageEach",
    dateData: ".budget__heading--span",
    grid: ".grid"
  }

  const CommaFormat = function(amount, type) {
    let amountSplit, int, dec, amm
    

    amount = Math.abs(amount);
    amount = amount.toFixed(2);

    amountSplit = amount.split('.');

    int = amountSplit[0];
    if (int.length > 3 && int.length < 6){
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }else if(int.length > 6 && int.length < 9){
      int = int.substr(0, int.length - 6) + ',' + int.substr(int.length - 6, 3) + ',' + int.substr(int.length - 3, 3);
    }else if(int.length > 9){
      int = int.substr(0, int.length - 9) + ',' + int.substr(int.length - 9, 3) + ',' + int.substr(int.length - 6, 3) + ',' + int.substr(int.length - 3, 3)
    }

    dec = amountSplit[1];

    if(type === "inc"){
      amm = `+${int}.${dec}`
    }else if(type === "exp"){
      amm = `-${int}.${dec}`
    }

    return amm

};



  return{



putDataInTheUi: function(items){
   let exp = "",inc= ""
   
  // const expense = document.querySelector(DOMselectors.expenseUL);
   items.exp.forEach(function(item){
    const expFormat = CommaFormat(item.value,'exp');
     exp += `<li id="exp-${item.id}">
     <div class="flexitem-1">
     ${item.description}: ${expFormat}&nbsp; <span class="percentage percentageEach" id="percentageEach">---</span> 
     </div>
     
     <div class="flexitem-2">
       <ion-icon name="trash-outline" class="edit"></ion-icon>
   </div>
     </li>`

   });

   document.querySelector(DOMselectors.expenseUL).innerHTML = exp;
  
  items.inc.forEach(function(item){
    const incFormat = CommaFormat(item.value,'inc');
    inc += `<li id="inc-${item.id}">
    <div class="flexitem-1">
    ${item.description}: ${incFormat}&nbsp;  
    </div>
    
    <div class="flexitem-2">
      <ion-icon name="trash-outline" class="edit"></ion-icon>
  </div>
    </li>`

  })
 
  document.querySelector(DOMselectors.incomeUL).innerHTML = inc;




  },
  getInput: function(){
   return{
    type: document.querySelector(DOMselectors.typeValue).value,
    
    description: document.querySelector(DOMselectors.inputName).value,
    
    value:parseFloat(document.querySelector(DOMselectors.inputValue).value)  

   };
  
  },
  clearInput: function(){
    document.querySelector(DOMselectors.inputName).value = "";
    
    document.querySelector(DOMselectors.inputValue).value = "" ; 

    document.querySelector(DOMselectors.inputName).focus();
  },

  displayBudget:function(items,type){
    const Format = CommaFormat(items.value,type)
    
    if(type === 'inc'){
      
      const li = document.createElement("li");

      li.id = `inc-${items.id}`
  
      li.innerHTML = `<div class="flexitem-1">
      ${items.description}: ${Format} &nbsp; 
      </div>
      
      <div class="flexitem-2">      
        <ion-icon name="trash-outline" class="edit"></ion-icon>
    </div>`

    document.querySelector(DOMselectors.incomeUL).insertAdjacentElement('beforeend', li)
  
    }else if(type === 'exp'){
      const li = document.createElement("li");

      li.id = `exp-${items.id}`
  
      li.innerHTML = `<div class="flexitem-1">
      ${items.description}: ${Format} &nbsp; <span class="percentage percentageEach" id="percentageEach"></span> 
      </div>
      
      <div class="flexitem-2">      
        <ion-icon name="trash-outline" class="edit"></ion-icon>
    </div>`

    document.querySelector(DOMselectors.expenseUL).insertAdjacentElement('beforeend', li)
  

    }
   
  },
  showBudget: function(bud){
    let type;
    
    
    
      document.querySelector(DOMselectors.incometotal).textContent = CommaFormat(bud.totalInc, 'inc');
    
    // else{
    //   document.querySelector(DOMselectors.incometotal).textContent = `${bud;
    // };
    
      document.querySelector(DOMselectors.expenseTotal).textContent = CommaFormat(bud.totalExp,'exp');
    
    // else{

    // };
    bud.totalBudget > 0 ? type = "inc" : type = "exp";
      
    document.querySelector(DOMselectors.total).textContent = CommaFormat(bud.totalBudget,type);
    
    // else{

    // };






if(bud.totalPercentage > 0){
  document.querySelector(DOMselectors.tPercentage).textContent = `${bud.totalPercentage}%`;

}else{
  document.querySelector(DOMselectors.tPercentage).textContent = "---";
}



  },
  showPercent:function(percent){
  const allPerc = document.querySelectorAll(DOMselectors.percentage)
  
  const allPercArr = Array.from(allPerc)

  allPercArr.forEach(function(perc){
      if(percent > 0){
        perc.textContent = `${percent}%`;
      }else{
        perc.textContent = `---`;
      }
  })
    // if(percent > 0){
    //   document.querySelector(DOMselectors.percentage).textContent = `${percent}%`;
    // }else{
    //   document.querySelector(DOMselectors.percentage).textContent = "---";
    // }

  },
  deleteInTheUI:function(id,type){
   const found = `#${type}-${id}`

   const del = document.querySelector(found);

    del.remove();

    
  },

  changeUI:function(){
    let field = document.querySelectorAll(`${DOMselectors.typeValue},${DOMselectors.inputName},${DOMselectors.inputValue}`)

    field = Array.from(field)

    field.forEach(function(fid){
      fid.classList.toggle("red-focus")
    })

    document.querySelector(DOMselectors.addButton).classList.toggle("red");


  },
  displayDate: function(){
//  let day,  month, year, 

 date = new Date();
 
 months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          

 day = date.getDate();
 month = date.getMonth();
 year = date.getFullYear();

 document.querySelector(DOMselectors.dateData).textContent = `${months[month]}    ${day},  ${year}`


  },

 selectors: function(){
   return DOMselectors;
 }
  
}
})();

//App controller
const App = (function(budgetCtrl,UICtrl,storageCtrl){

  const loadEventListener = function(){
    const selectors = UICtrl.selectors();
  
    document.querySelector(selectors.addButton).addEventListener("click", addBudgetInput);
    
    document.querySelector(selectors.grid).addEventListener("click", deleteInput);

    document.addEventListener("keypress",function(e){
   if(e.keycode === 13 || e.which === 13){
       addBudgetInput()
   
    }});

    document.querySelector(selectors.typeValue).addEventListener("change", UICtrl.changeUI)
  };


  // This is the function on the add button
const addBudgetInput = function(e){
 
  const input = UICtrl.getInput();
  
  if(input.value !== "" && input.description !== "" && input.value > 0){
     
    const budget = budgetCtrl.addBudgetInTheCtrl(input.type,input.description,input.value)

    UICtrl.displayBudget(budget,input.type)

    UICtrl.clearInput()
    
    const getBudget = budgetCtrl.getBudget()

    UICtrl.showBudget(getBudget);

    const getPercent = budgetCtrl.getPercent()

    UICtrl.showPercent(getPercent);
    
    // storageCtrl.storeItem(budget,input.type)
    // storageCtrl.storeItemI(budget,input.type)
 
  }
  }

  const deleteInput = function(e){

    if(e.target.classList.contains("edit")){

   const delTarget = e.target.parentNode.parentNode.id;
  
   const del = delTarget.split('-')

      const ID = del[1]
      const type = del[0]
    
      
    budgetCtrl.deleteInTheCtrl(ID,type)

    UICtrl.deleteInTheUI(ID,type)

    const getBudget = budgetCtrl.getBudget()

    UICtrl.showBudget(getBudget);

    const getPercent = budgetCtrl.getPercent()

    UICtrl.showPercent(getPercent);

    // storageCtrl.deleteItem(delTarget)
    // storageCtrl.deleteItemI(delTarget)

    }


  e.preventDefault();
  }
  

  return{
  
  init: function(){
    UICtrl.displayDate();
    
    const getBudget = budgetCtrl.getBudget()

    UICtrl.showBudget(getBudget);

    const populate = budgetCtrl.populateData();
 
    UICtrl.putDataInTheUi(populate)
    

    loadEventListener();
 
}
  
  }
})(budgetCtrl,UICtrl);

App.init();
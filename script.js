//console.log(pizzaJson);
let modalQt = 1;// Começa com um.
let cart = [];//Carrinho
let modalKey = 0;// Qual pizza selecionada

//Cria uma constante para querySelector
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

const priceG = pizzaJson[modalKey].price;
const priceM = pizzaJson[modalKey].priceM;
const priceP = pizzaJson[modalKey].priceP;

const actualPriceG = c('.pizzaInfo--actualPrice');
const actualPriceM = c('.pizzaInfo--actualPriceM');
const actualPriceP = c('.pizzaInfo--actualPriceP');

//Mapear o pizzaJson // Listagem das Pizzas
pizzaJson.map((item, index) => {// Faz a cópia mapeia e joga na tela
  //console.log(item);
  let pizzaItem = c('.models .pizza-item').cloneNode(true);// Clona pizza-item do models
  let pi = (el) => pizzaItem.querySelector(el);

  pizzaItem.setAttribute('data-key', index);//Insere a pizza especifica no index

  pi('.pizza-item--img img').src = item.img;
  // Preço formatado fixa 2 algarismos após a virgula
  pi('.pizza-item--price').innerHTML = `${item.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`;

  
  pi('.pizza-item--name').innerHTML = item.name;
  pi('.pizza-item--desc').innerHTML = item.description;
  pi('a').addEventListener('click', (e) => {//Evento de clique na tag 'a'
    e.preventDefault();//Retira evento padrão de clique
    // Abre o Modal
    let key = e.target.closest('.pizza-item').getAttribute('data-key');//Pega atributo data-key
    modalQt = 1;//Quantidade no Modal
    modalKey = key;// Qual pizza escolhida?        
    //console.log(pizzaJson[key]);//console.log('PIZZA CLICADA: '+key);

    c('.pizzaBig img').src = item.img;
    c('.pizzaInfo h1').innerHTML = item.name;//Pega os dados da pizza para o modal
    c('.pizzaInfo--desc').innerHTML = item.description;

    actualPriceG.innerHTML = `${item.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`;
    actualPriceM.innerHTML = `${item.priceM.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`;
    actualPriceP.innerHTML = `${item.priceP.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`;
    
    c('.pizzaInfo--size.selected').classList.remove('selected');// Remove item selecionado

    cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {//Reseta o Modal
        size.classList.add('selected');//Mostra grande marcada no modal
        actualPriceM.style.display = 'none';
        actualPriceP.style.display = 'none';
        actualPriceG.style.display = 'block';
      }
      
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    // Aqui infos do Modal
    c('.pizzaInfo--qt').innerHTML = modalQt;//Reseta a quantidade no modal

    c('.pizzaBig img').src = pizzaJson[key].img;// Imagem da pizza para o modal
    c('.pizzaWindowArea').style.opacity = 0;//Animação do Modal
    c('.pizzaWindowArea').style.display = 'flex';//Aparece o Modal
    setTimeout(() => {
      c('.pizzaWindowArea').style.opacity = 1;//Animação do Modal
    }, 200);
  });

  // Preencher as informações em pizzaItem
  c('.pizza-area').append(pizzaItem);//Acrescenta na pizza-area os items
  
});

/*-------------------------------------------------*/

// Eventos do Modal
function closeModal() {
  c('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => {
    c('.pizzaWindowArea').style.display = 'none';
  }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
  item.addEventListener('click', closeModal);
});

// Ação de clique em 'menos' quantidade no modal
c('.pizzaInfo--qtmenos').addEventListener('click', () => {let mqt = modalQt;
  if (modalQt > 1) {
    modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;        
  }

  // Reduzir Preço conforme Quantidade.
  if(actualPriceG) { 
    let modalTotal = modalQt * pizzaJson[modalKey].price;   
    actualPriceG.innerHTML = modalTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });    
  }  
  if(actualPriceM) {           
    let modalTotalM = modalQt * pizzaJson[modalKey].priceM;    
    actualPriceM.innerHTML = modalTotalM.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });  
  }
  if(actualPriceP) {            
    let modalTotalP = modalQt * pizzaJson[modalKey].priceP;    
    actualPriceP.innerHTML = modalTotalP.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });  
  }
  
});

// Ação de clique em 'mais' quantidade no modal
c('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalQt++;
  c('.pizzaInfo--qt').innerHTML = modalQt;
     
  // Somar Preço conforme Quantidade.
  if(actualPriceG) { 
    let modalTotal = modalQt * pizzaJson[modalKey].price;   
    actualPriceG.innerHTML = modalTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });    
  }  
  if(actualPriceM) {           
    let modalTotalM = modalQt * pizzaJson[modalKey].priceM;    
    actualPriceM.innerHTML = modalTotalM.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });  
  }
  if(actualPriceP) {            
    let modalTotalP = modalQt * pizzaJson[modalKey].priceP;    
    actualPriceP.innerHTML = modalTotalP.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });  
  }

});


// Seleção de Tamanhos
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
  
  size.addEventListener('click', (e) => {//Clicoudesmarca tudo seleciona o seu
    c('.pizzaInfo--size.selected').classList.remove('selected');//tira todos    
    size.classList.add('selected');// Seleciona o seu 

    // Pega o preço conforme o tamanho        
    switch(sizeIndex) {
      case 0:// Caso seja Pizza Pequena
        
        actualPriceP.style.display = 'block';// mostra priceP
        actualPriceG.style.display = 'none';// Esconde priceG
        actualPriceM.style.display = 'none';// Esconde priceM
        actualPriceP.innerHTML = pizzaJson[modalKey].priceP.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        modalQt = 1;
        c('.pizzaInfo--qt').innerHTML = 1;
      break;
      case 1:// Caso seja Pizza Média    
        actualPriceM.style.display = 'block';// mostra priceM
        actualPriceG.style.display = 'none';// Esconde priceG
        actualPriceP.style.display = 'none';// Esconde priceP        
        actualPriceM.innerHTML = pizzaJson[modalKey].priceM.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        modalQt = 1;
        c('.pizzaInfo--qt').innerHTML = 1;
      break;
      case 2:// Caso seja Pizza Grande
        let priceG = pizzaJson[modalKey].price;
        actualPriceG.style.display = 'block';// mostra priceG
        actualPriceM.style.display = 'none';// Esconde priceM
        actualPriceP.style.display = 'none';// Esconde priceP
        actualPriceG.innerHTML = priceG.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        modalQt = 1;
        c('.pizzaInfo--qt').innerHTML = 1;
      break;
    }                 
  });  
});


// Adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {

  let modalTotal = modalQt * priceG;   
    actualPriceG.innerHTML = modalTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

  //* Qual pizza?
  console.log("Pizza: "+modalKey);
  //* Qual o tamanho?
  let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
  console.log("Tamanho: "+size);
  //* Quantas pizzas?
  //console.log('Quantidade: '+modalQt);

  let indentifier = pizzaJson[modalKey].id + '@' + size;//Junta as qtdades pelo id
  //Retorna o index do produto
  let key = cart.findIndex((item) => item.indentifier == indentifier);
  
  if(key > -1) {// Se achou o item no carrinho
    cart[key].qt += modalQt;// Aumenta a quantidade do mesmo item
  } else {// Adiciona a pizza
    cart.push({
      indentifier,// Aumenta a quantidade do mesmo id
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt
    });
  }
  
  updateCart();// Atualiza os itens no carrinho
  closeModal();// Fecha o Modal
});


/*---------------------------------------*/

// Eventos do Mobile
c('.menu-openner').addEventListener('click', () => {
  if (cart.length > 0) {
    c('aside').style.left = '0';
  }
});
c('.menu-closer').addEventListener('click', () => {
  c('aside').style.left = '100vw';
});

// Atualizar carrinho.
function updateCart() {
  c('.menu-openner span').innerHTML = cart.length;// Add no cart mobile

  if (cart.length > 0) {// Se tiver itens no cart mostra cart
    c('aside').classList.add('show');// mostra cart
    c('.cart').innerHTML = ''; //Zera os itens e tira da tela.

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      // Pega item e exibe na tela carrinho 
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);//Q!ual pizza?      
      let cartItem = c('.models .cart--item').cloneNode(true);

      let pizzaSizeName;
      switch(cart[i].size) {
        case 0:
          pizzaSizeName = 'P';
          subtotal += pizzaItem.priceP * cart[i].qt;
          break;
        case 1:
          pizzaSizeName = 'M';
          subtotal += pizzaItem.priceM * cart[i].qt;
          break;
        case 2:
          pizzaSizeName = 'G';
          subtotal += pizzaItem.price * cart[i].qt;
          break;
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if (cart[i].qt > 1) {//Se qt for maior que um
          cart[i].qt--;// Diminui do cart
        } else {
          cart.splice(i, 1);// Fecha Modal
        }
        updateCart();
      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].qt++;// Aumenta qt no cart
        updateCart();//Atualiza a qt no cart
      });

      c('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

  } else {
    c('aside').classList.remove('show');// Esconde cart
    c('aside').style.left = '100vw';// Esconde cart no Mobile ao qt = zero
  }
}
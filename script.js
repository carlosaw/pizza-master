//console.log(pizzaJson);
let modalQt = 1;//Opacidade do Modal
let cart = [];//Carrinho
let modalKey = 0;// Qual pizza selecionada

//Cria uma constante para querySelector
const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

//Mapear o pizzaJson // Listagem das Pizzas
pizzaJson.map((item, index) => {// Faz a cópia mapeia e joga na tela
    //console.log(item);
    let pizzaItem = c('.models .pizza-item').cloneNode(true);// Clona pizza-item do models
    let pi = (el) => pizzaItem.querySelector(el);

    pizzaItem.setAttribute('data-key', index);//Insere a pizza especifica no index
    pi('.pizza-item--img img').src = item.img;
    // Preço formatado fixa 2 algarismos após a virgula
    pi('.pizza-item--price').innerHTML = `${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
    /*.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;*/
    pi('.pizza-item--name').innerHTML = item.name;
    pi('.pizza-item--desc').innerHTML = item.description;
    pi('a').addEventListener('click', (e)=>{//Evento de clique na tag 'a'
        e.preventDefault();//Retira evento padrão de clique
        // Abre o Modal
        let key = e.target.closest('.pizza-item').getAttribute('data-key');//Pega atributo data-key
        modalQt = 1;//Quantidadee no Modal
        modalKey = key;// Qual pizza escolhida?        
        //console.log(pizzaJson[key]);//console.log('PIZZA CLICADA: '+key);

        c('.pizzaBig img').src = item.img;
        c('.pizzaInfo h1').innerHTML = item.name;//Pega os dados da pizza para o modal
        c('.pizzaInfo--desc').innerHTML = item.description;
        c('.pizzaInfo--actualPrice').innerHTML = `${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;

        c('.pizzaInfo--size.selected').classList.remove('selected');// Remove item selecionado

        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {//Reseta o Modal
                size.classList.add('selected');//Mostra grande marcada no modal

            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        // Aqui infos do Modal
        c('.pizzaInfo--qt').innerHTML = modalQt;//Reseta a quantidade no modal

        c('.pizzaBig img').src = pizzaJson[key].img;// Imagem da pizza para o modal
        c('.pizzaWindowArea').style.opacity = 0;//Animação do Modal
        c('.pizzaWindowArea').style.display = 'flex';//Aparece o Modal
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;//Animação do Modal
        }, 200);
    });
    
    // Preencher as informações em pizzaItem
    c('.pizza-area').append( pizzaItem );//Acrescenta na pizza-area os items
});

// Eventos do Modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
    c('.pizzaWindowArea').style.display = 'none';   
    }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
// Ação de quantidade no modal
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }    
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
// Seleção de Tamanhos
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', ()=>{//Clicou num item desmarca tudo marca o seu
        c('.pizzaInfo--size.selected').classList.remove('selected');//tira todos
        size.classList.add('selected');// Marca o seu
    });
});

// Adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    // Qual pizza?
    // console.log("Pizza: "+modalKey);
    // Qual o tamanho?
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    // console.log("Tamanho: "+size);
    // Quantas pizzas?
    // console.log('Quantidade: '+modalQt);
    let indentifier = pizzaJson[modalKey].id+'@'+size;//Junta as qtdades pelo id
    //Retorna o index do produto
    let key = cart.findIndex((item)=>item.indentifier == indentifier);

    if(key > -1) {// Se achou o item no carrinho
        cart[key].qt += modalQt;// Aumenta a quantidade do mesmo item
    } else {// Adiciona só a quantidade
        cart.push({
            indentifier,// Aumenta a quantidade do mesmo id
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();// Atualiza os itens no carrinho
    closeModal();// Fecha o Modal
});

// Eventos do Mobile
c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

// Atualizar carrinho.
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;// Add no cart mobile

    if(cart.length > 0) {// Se tiver itens no cart mostra cart
        c('aside').classList.add('show');// mostra cart
        c('.cart').innerHTML = ''; //Zera os itens e tira da tela.

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            // Pega item a item e exibe na tela carrinho 
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt;
            
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {//Se qt for maior que um
                    cart[i].qt--;// Diminui do cart
                }  else {
                    cart.splice(i, 1);// Fecha Modal
                }   
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
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
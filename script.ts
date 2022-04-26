type Veiculo = {
  nome: string;
  placa: string;
  entrada: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query);  

  function calcTempo(milis: number) {
    const min = Math.floor(milis / 60000);
    const seg = Math.floor((milis % 60000) / 1000);

    return `${min}m e ${seg}s`;
  }

  function lerPrecoPorMinuto(): number {
    if (localStorage.preco) {
      return localStorage.preco
    } else {
      localStorage.setItem('preco', '0.20');
    }
    return localStorage.preco
  }

  function renderBanner() {
    $('#banner')!.innerHTML = "";      

    const precoPorMinute = lerPrecoPorMinuto();

    $('#preco')!.value = precoPorMinute.toString();

    $('#banner')!.innerHTML = `R$ ${precoPorMinute} por minuto!!!`;
  }

  function patio() {

     function ler(): Veiculo[] {
      // if (localStorage.patio) {
      //   return JSON.parse(localStorage.patio)
      // } else {
      //   return [{nome: "Vazio", placa: "Vazio", entrada: new Date()}]
      // }
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];  
    }

    function salvar(veiculos: Veiculo[]) {      
      localStorage.setItem("patio", JSON.stringify(veiculos));
    }

    function adicionar(veiculo: Veiculo, salva?: boolean) {

      const row = document.createElement("tr");
    
      row.innerHTML = `
        <td>${veiculo.nome}</td>
        <td>${veiculo.placa}</td>
        <td>${veiculo.entrada}</td>
        <td class="tdbtn">
          <button class="delete btn btn-danger btn-sm" data-placa="${veiculo.placa}">x</button>
        </td>
      `

      row.querySelector(".delete")?.addEventListener("click", function(this: HTMLButtonElement){
        remover(this.dataset.placa as string);
      })

      $("#patio")?.appendChild(row);

      if(salva) salvar([...ler(), veiculo]);
    }

    function remover(placa: string) {
      const {nome, entrada} = ler().find( (veic) => veic.placa === placa ) as Veiculo;
      const milis = new Date().getTime() - new Date(entrada).getTime();        
      const tempo = calcTempo(milis) ;
      if (!confirm(`O veículo ${nome} permaneceu por ${tempo} e custou R$ ${ (Math.floor(milis / 60000) * lerPrecoPorMinuto()).toFixed(2)} . Deseja encerar?`)) {
        return;
      }
      salvar(ler().filter((veiculo) => veiculo.placa !== placa));
      render();        
    }

    function render() {
      $('#patio')!.innerHTML = "";

      const patio = ler();

      if (patio.length) {
        patio.forEach((veiculo) => adicionar(veiculo));
      }
    }

    return {
      ler, adicionar, remover, salvar, render
    }
  }
  
  patio().render();
  renderBanner();

  $("#cadastrar")?.addEventListener("click", () => {
    const nome = $("#nome")?.value;
    const placa = $("#placa")?.value;

    console.log({nome, placa});
    
    if (!nome || !placa) {
      alert("Os campos nome e placa são obrigatórios");
      return;
    } 
    
    const row = patio().adicionar({nome, placa, entrada: new Date().toISOString()}, true)
    let name = document.getElementById("nome") as HTMLInputElement;
    let plac = document.getElementById("placa") as HTMLInputElement;;
    name.value = "";
    plac.value = "";
  })

  $("#preco-por-minuto")?.addEventListener("click", () => {  
    let preco: number = parseFloat($("#preco")?.value); 

    localStorage.setItem("preco", preco.toFixed(2).toString());  
    renderBanner();
  })
})();
(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(milis) {
        const min = Math.floor(milis / 60000);
        const seg = Math.floor((milis % 60000) / 1000);
        return `${min}m e ${seg}s`;
    }
    function patio() {
        function ler() {
            // if (localStorage.patio) {
            //   return JSON.parse(localStorage.patio)
            // } else {
            //   return [{nome: "Vazio", placa: "Vazio", entrada: new Date()}]
            // }
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${veiculo.nome}</td>
        <td>${veiculo.placa}</td>
        <td>${veiculo.entrada}</td>
        <td class="tdbtn">
          <button class="delete btn btn-danger btn-sm" data-placa="${veiculo.placa}">x</button>
        </td>
      `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva)
                salvar([...ler(), veiculo]);
        }
        function remover(placa) {
            const { nome, entrada } = ler().find((veic) => veic.placa === placa);
            const milis = new Date().getTime() - new Date(entrada).getTime();
            const tempo = calcTempo(milis);
            if (!confirm(`O veículo ${nome} permaneceu por ${tempo} e custou R$ ${(Math.floor(milis / 60000) * 0.2).toFixed(2)} . Deseja encerar?`)) {
                return;
            }
            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            render();
        }
        function render() {
            $('#patio').innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return {
            ler, adicionar, remover, salvar, render
        };
    }
    patio().render();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        console.log({ nome, placa });
        if (!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        const row = patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
        let name = document.getElementById("nome");
        let plac = document.getElementById("placa");
        ;
        name.value = "";
        plac.value = "";
    });
})();

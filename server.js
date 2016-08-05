var compression = require('compression');
var express = require('express');

var app = express();

app.use(compression());

app.use(express.static(__dirname));

var postUris = [
  '/api-web/beneficiario/cartao/alterar-senha',
  '/api-web/beneficiario/cartao/bloquear',
  '/api-web/beneficiario/cartao/esqueci-senha',
  '/api-web/ec/contrato/aceitar'];

for (var i = 0; i < postUris.length; i++) {
  app.post(postUris[i], function (req, res) {
    res.send('{"message":"Operação realizada com sucesso"}');
  });
}

// POSTS especificos
app.post('/api-web/beneficiario/promocoes/consultar-qtd-novas-promocoes', function (req, res) {
  res.send('2');
});

app.post('/api-web/beneficiario/promocoes/salvar-visualizacao-novas-promocoes', function (req, res) {
  res.send('true');
});

app.post('/api-web/ec/contrato/gravar-dados-banc-qualific', function (req, res) {
  res.send('{"validado":true}');
});


// REDIRECTS (camada de compatibilidade entre ambientes)
app.get('/portal/app/UI-EC/painel-reembolso.html', function (req, res) {
  res.redirect('/estabelecimentos/reembolso.html');
});

app.get('/portal/portal-vr/area-restrita/vr-e-estabelecimentos/dados-do-estabelecimento.html', function (req, res) {
  res.redirect('/estabelecimentos/estabelecimento.html');
});


app.listen(process.env.PORT || 3030, function () {
  console.log('Server running on port 3030.');
});

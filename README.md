# desafio-b2w
Feita para o [Desafio B2W](https://github.com/admatic-tool/vaga-b2wads-senior), consiste em três API Rest feita em NodeJs, utilizando o framework Express, ES6, MongoDb, Rabbitmq e Docker Compose.

# Detalhes
A API Transação recebe informaçes de COMPRA DE INGRESSOS, após realizar algumas validaçes, a API cria uma nova transação, 
depois envia informaçes de INGRESSO POR SHOW para serem gravadads na API FOO e informaçes de VALOR POR SHOW na API FIGHTERS.
Caso ocorra alguma indisponibilidade enquanto a Transação está sendo processada, as informações de COMPRA DE INGRESSOS são colocadas
em um Fila, para reprocessamento posterior, são realizadas até 5 tentativas de reprocessamento antes que a transação seja considerada
falha. Em caso de sucesso na transação, são retornadas as informações de COMPRA DE INGRESSO e i id da transação.

# Dependência
Necessário apenas ter o [Docker](https://docs.docker.com/install/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

# Instalação
Após clone
```sh
$ cd desafio-b2w
```
O Docker vai baixar todas as dependências, realizar build dos pacotes, e subir todos os containers.
```sh
$ sudo docker-compose up -d
```
Aṕos o terminar de subir os containers das três aplicações, do mongoDb e do Rabbitmq, basta acessar as portas das APIs para utilização.

# Portas das APIs
API Transação: 8080

API FOO: 3000

API FIGHTERS: 4000

# Testes integrados e unitários
Os testes são realizados através do ambiente Docker, para realizar os testes basta executar os seguintes comandos:

API Transação
```sh
$ sudo docker-compose -f ./tests/docker-compose-test.yml up api-transacao-test
```

API FOO
```sh
$ sudo docker-compose -f ./tests/docker-compose-test.yml up api-foo-test
```

API FIGTHERS
```sh
$ sudo docker-compose -f ./tests/docker-compose-test.yml up api-fighters-test
```

Obs.: Entre os testes, utilizar o comando
```sh
$ sudo docker-compose -f ./tests/docker-compose-test.yml down
```
para encerrar os containers do teste anterior.


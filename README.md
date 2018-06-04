# desafio-b2w
Feita para o [Desafio B2W](https://github.com/admatic-tool/vaga-b2wads-senior), consiste em  quatro microsserviços Docker, sendo três APIs Rest e um worker para gerenciamento de transações. Foram criados utilizando NodeJs com framework Express, ES6, MongoDb, Rabbitmq e orquestrados via Docker Compose.

## Detalhes
A **api-transacao** recebe informaçes de COMPRA DE INGRESSOS, após realizar algumas validaçes, a API cria uma nova transação, envia para fila e devolve para o chamador as informações da transação criada com estado 'pending'. 
O **worker-transacao** recupera a transação da fila e executa todos os passos para finalização da transação.

Os passos para finalização da transação são:
- Enviar informaçes de INGRESSO POR SHOW para serem gravadas na **api-foo**.
- Enviar informaçes de VALOR POR SHOW para serem gravadas na **api-fighters**.

Caso ocorra alguma indisponibilidade enquanto a transação está sendo processada, a transação é colocada na fila para reprocessamento posterior, armazenando o passo em que a mesma parou, para que sejam executados apenas os passos que faltam.
São realizadas até 5 tentativas de reprocessamento de cada passo antes que a transação seja considerada falha. 

## Dependência
Necessário ter o [Docker](https://docs.docker.com/install/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

## Instalação
Após clone, executar o comando:
```sh
$ cd desafio-b2w
```
O Docker vai baixar todas as dependências, realizar build dos pacotes, e subir todos os containers:
```sh
$ sudo docker-compose up -d
```
Aṕos o terminar de subir os containers das aplicações, do mongoDb e do Rabbitmq, basta acessar as portas das APIs para utilização.

## Endpoints das APIs
#### API Transação: 
- Default: http://localhost:8080/
- POST de COMPRA INGRESSO: http://localhost:8080/api/v1/transacao
  - Exemplo de COMPRA INGRESSO:
  ```sh
  {
    "data_compra": "2019-01-01",
    "account_id": "265923",
    "id_ingresso": "33",
    "id_show": "102",
    "valor": 330
  }
  ```
- GET Transação: http://localhost:8080/api/v1/transacao?id_transacao=[ID_DA_TRANSACAO]

#### API FOO: 
  - Default: http://localhost:3000/
  - POST de INGRESSO POR SHOW: http://localhost:3000/api/v1/tickets
    - Exemplo de INGRESSO POR SHOW:
    ```sh
    {
      "id_ingresso": "33",
      "id_show": "102"
    }
    ```
  - GET Total de ingressos por show: http://localhost:3000/api/v1/ticket?id_show=[ID_DO_SHOW]
  - GET Valida se id_ingresso e id_show é uma combinação válida: http://localhost:3000/api/v1/tickets/validate?id_show=[ID_DO_SHOW]&id_ingresso=[ID_DO_INGRESSO]
  
#### API FIGHTERS: 
  - Default: http://localhost:4000/
  - POST de VALOR POR SHOW: http://localhost:4000/api/v1/valores
    - Exemplo de VALOR POR SHOW:
    ```sh
    {
      "id_show": "102",
      "valor": 330
    }
    ```
  - GET valor total por show: http://localhost:4000/api/v1/valores?id_show=[ID_DO_SHOW]
  - GET ticket médio do show: http://localhost:4000/api/v1/valores/ticket-medio?id_show=[ID_DO_SHOW]

## Testes integrados e unitários
Os testes são realizados através do ambiente Docker, para realizar os testes basta executar os seguintes comandos:

#### API FOO
```sh
$ sudo docker-compose -f ./docker-compose-test.yml up api-foo-test
```

#### API FIGTHERS
```sh
$ sudo docker-compose -f ./docker-compose-test.yml up api-fighters-test
```

#### API Transação
```sh
$ sudo docker-compose -f ./docker-compose-test.yml up api-transacao-test
```

#### Worker Transação
```sh
$ sudo docker-compose -f ./docker-compose-test.yml up worker-transacao-test
```

#### Testes de falhas e retentativas
```sh
$ sudo docker-compose -f ./docker-compose-test.yml up worker-transacao-test-fail
```

**Obs.**: Entre os testes, utilizar o comando abaixo para parar os containers do teste anterior:
```sh
$ sudo docker-compose -f ./docker-compose-test.yml down
```



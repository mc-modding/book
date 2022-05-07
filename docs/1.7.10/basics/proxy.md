description: Объяснение того, как Forge загружает мод в Minecraft. Названия стадий загрузки и советы по их использованию.

# Прокси

Перед началом создания модов надо понять и правильно использовать очень важную вещь.

Дело в том, что Minecraft состоит из нескольких частей:

* **Физический клиент** - это программа, которую вы запускаете с помощью лаунчера.
* **Физический сервер** - это программа, которая запускается с помощью файлов типа `minecraft_server.jar`.
* **Логический клиент** отвечает за отображение моделей и текстур, за прием данных от мышки и клавиатуры, за отображение GUI.
* **Логический сервер** отвечает за всю игровую логику: спавн мобов, погоду, обновление инвентарей, AI и все другие механики игры.

Зачем надо это знать? А затем, что при попытке выполнить отрисовку текстуры блока на стороне **сервера** он незамедлительно крашнется!
И наоборот, попытка реализовывать игровую механику (открытие GUI, создание взрывов) на стороне **клиента** может привести к
непредсказуемым багам, появлению пустых твердых блоков, рассинхронизации и так далее...

Именно поэтому так важно еще до создания блоков/мобов/предметов и т.д. настроить прокси, для удобного указания, какие
части мода должны выполняться на стороне клиента, сервера, а может и на обеих сторонах.

## CommonProxy

Для начала нам надо создать класс для выполнения действий, которые должны выполняться на стороне и клиента, и сервера.

Для этого создайте пакет common внутри пакета нашего мода и класс CommonProxy внутри него. Объявите внутри класса три уже знакомых вам
метода:

* pre
* init
* post

```java
package ru.mcmodding.tutorial.common;

import cpw.mods.fml.common.event.FMLInitializationEvent;
import cpw.mods.fml.common.event.FMLPostInitializationEvent;
import cpw.mods.fml.common.event.FMLPreInitializationEvent;

public class CommonProxy {
    public void pre(FMLPreInitializationEvent e) {
    }

    public void init(FMLInitializationEvent e) {
    }

    public void post(FMLPostInitializationEvent e) {
    }
}
```

## ClientProxy

Теперь создадим класс для действий, которые должны выполняться только на стороне клиента, а именно:

* Регистрация моделей блоков/мобов/предметов
* Регистрация рендеров этих самых моделей
* ...

Для этого создадим класс ClientProxy, наследующий класс CommonProxy в пакете client:

```java
package ru.mcmodding.tutorial.client;

import cpw.mods.fml.common.event.FMLInitializationEvent;
import cpw.mods.fml.common.event.FMLPostInitializationEvent;
import cpw.mods.fml.common.event.FMLPreInitializationEvent;
import ru.mcmodding.tutorial.common.CommonProxy;

public class ClientProxy extends CommonProxy {
    @Override
    public void pre(FMLPreInitializationEvent e) {
        super.pre(e);
    }

    @Override
    public void init(FMLInitializationEvent e) {
        super.init(e);
    }

    @Override
    public void post(FMLPostInitializationEvent e) {
        super.post(e);
    }
}
```

Заметьте, что мы вызываем все три метода из CommonProxy с помощью `super`, чтобы они обязательно выполнились на стороне клиента.

## Регистрация в главном файле

Теперь мы полностью можем управлять, какие части нашего мода должны выполняться на сервере, клиенте, или вообще на обеих сторонах.

Теперь вернемся в главный файл нашего мода и скажем Forge об этом. Для того чтобы это сделать, создадим переменную proxy типа CommonProxy
и добавим к ней аннотацию `@SidedProxy`:

```java
@SidedProxy(
        clientSide = "ru.mcmodding.tutorial.client.ClientProxy",
        serverSide = "ru.mcmodding.tutorial.common.CommonProxy"
)
public static CommonProxy proxy;
```

Эта аннотация содержит два поля, которые обозначают пути до классов ClientProxy и CommonProxy. При запуске, Forge будет
автоматически определять нужную сторону (клиент/сервер) и создавать объект класса ClientProxy или CommonProxy.

Последнее, что нам нужно сделать: выполнить три метода (pre, init, post) в нашем главном файле мода:

```java
@EventHandler
public void preInit(FMLPreInitializationEvent e) {
    proxy.pre(e);
}

@EventHandler
public void init(FMLInitializationEvent e){
    proxy.init(e);
}

@EventHandler
public void postInit(FMLPostInitializationEvent e) {
    proxy.post(e);
}
```

Полный код главного файла мода:

```java
package ru.mcmodding.tutorial;

import cpw.mods.fml.common.Mod;
import cpw.mods.fml.common.Mod.EventHandler;
import cpw.mods.fml.common.SidedProxy;
import cpw.mods.fml.common.event.FMLInitializationEvent;
import cpw.mods.fml.common.event.FMLPostInitializationEvent;
import cpw.mods.fml.common.event.FMLPreInitializationEvent;
import ru.mcmodding.tutorial.common.CommonProxy;

import static ru.mcmodding.tutorial.McModding.MOD_ID;
import static ru.mcmodding.tutorial.McModding.VERSION;

@Mod(modid = MOD_ID, version = VERSION)
public class McModding {
    public static final String MOD_ID = "mcmodding";
    public static final String VERSION = "1.0.0";

    @SidedProxy(
            clientSide = "ru.mcmodding.tutorial.client.ClientProxy",
            serverSide = "ru.mcmodding.tutorial.common.CommonProxy"
    )
    public static CommonProxy proxy;

    @EventHandler
    public void pre(FMLPreInitializationEvent e) {
        proxy.pre(e);
    }

    @EventHandler
    public void init(FMLInitializationEvent e) {
        proxy.init(e);
    }

    @EventHandler
    public void post(FMLPostInitializationEvent e) {
        proxy.post(e);
    }
}
```
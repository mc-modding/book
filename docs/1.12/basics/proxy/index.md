description: Объяснение того, как Forge загружает мод в Minecraft. Названия стадий загрузки и советы по их использованию.

# Прокси

Перед началом создания модов надо понять и правильно использовать очень важную вещь.

Дело в том, что Minecraft состоит из нескольких частей:

* **Физический клиент** — это программа, которую вы запускаете с помощью лаунчера.
* **Физический сервер**, который часто называется выделенным сервером — программа, которая запускается с помощью файлов типа
`minecraft_server.jar`.
* **Логический клиент** отвечает за отображение моделей и текстур, за прием данных от мышки и клавиатуры, за отображение GUI.
* **Логический сервер** отвечает за всю игровую логику: спавн мобов, погоду, обновление инвентарей, AI и все другие механики игры.

Зачем надо это знать? А затем, что при попытке выполнить отрисовку текстуры блока на стороне **сервера** он незамедлительно крашнется!
И наоборот, попытка реализовывать игровую механику (открытие GUI, создание взрывов) на стороне **клиента** может привести к
непредсказуемым багам, появлению пустых твердых блоков, рассинхронизации и так далее...

Именно поэтому так важно еще до создания блоков/мобов/предметов и т.д. настроить прокси, для удобного указания, какие
части мода должны выполняться на стороне клиента, сервера, а может и на обеих сторонах.

## CommonProxy

Для начала нам надо создать класс для выполнения действий, которые должны выполняться на стороне и клиента, и сервера.

Для этого создайте пакет proxy внутри пакета нашего мода и класс CommonProxy внутри него. Объявите внутри класса три уже знакомых вам
метода:

* preInit
* init
* postInit

```java
public class CommonProxy
{
    public void preInit(FMLPreInitializationEvent event)
    {

    }

    public void init(FMLInitializationEvent event)
    {

    }

    public void postInit(FMLPostInitializationEvent event) {

    }

}
```

## ClientProxy

Теперь создадим класс для действий, которые должны выполняться только на стороне клиента, а именно:

* Регистрация моделей блоков/мобов/предметов
* Регистрация рендеров этих самых моделей
* ...

Для этого создадим класс ClientProxy, наследующий класс CommonProxy в пакете proxy:

```java
public class ClientProxy extends CommonProxy
{
    @Override
    public void preInit(FMLPreInitializationEvent event)
    {
        super.preInit(event);
    }

    @Override
    public void init(FMLInitializationEvent event)
    {
        super.init(event);
    }

    @Override
    public void postInit(FMLPostInitializationEvent event)
    {
        super.postInit(event);
    }
}
```

Заметьте, что мы вызываем все три метода из CommonProxy с помощью `super`, чтобы они обязательно выполнились на стороне клиента.

## Регистрация в главном файле

Теперь мы полностью можем управлять, какие части нашего мода должны выполняться на сервере, клиенте, или вообще на обеих сторонах.

Теперь вернемся в главный файл нашего мода и скажем Forge об этом. Для того, чтобы это сделать, создадим переменную proxy типа CommonProxy
и добавим к ней аннотацию `@SidedProxy`:

```java
@SidedProxy(clientSide = "ru.ivasik.tutorial.proxy.ClientProxy", serverSide = "ru.ivasik.tutorial.proxy.CommonProxy")
public static CommonProxy proxy;
```

Эта аннотация содержит два поля, которые обозначают пути до классов ClientProxy и CommonProxy. При запуске, Forge будет
автоматически определять нужную сторону (клиент/сервер) и создавать объект класса ClientProxy или CommonProxy.

Последнее, что нам нужно сделать: выполнить три метода (preInit, init, postInit) в нашем главном файле мода:

```java
@EventHandler
public void preInit(FMLPreInitializationEvent event)
{
    proxy.preInit(event);
}

@EventHandler
public void init(FMLInitializationEvent event)
{
    proxy.init(event);
}

@EventHandler
public void postInit(FMLPostInitializationEvent event)
{
    proxy.postInit(event);
}
```

Полный код главного файла мода:

```java
package ru.ivasik.tutorial;

import ru.mcmodding.testmod.proxy.CommonProxy;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.Mod.EventHandler;
import net.minecraftforge.fml.common.SidedProxy;
import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPostInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;

@Mod(modid = Tutorial.MODID /* имя мода */, version = Tutorial.VERSION /* его версия */)
public class Tutorial
{
    public static final String MODID = "tut";
    public static final String VERSION = "1.0";
    
    @SidedProxy(clientSide = "ru.ivasik.tutorial.proxy.ClientProxy", serverSide = "ru.ivasik.tutorial.proxy.CommonProxy")
    public static CommonProxy proxy;

    @EventHandler
    public void preInit(FMLPreInitializationEvent event)
    {
        proxy.preInit(event);
    }

    @EventHandler
    public void init(FMLInitializationEvent event)
    {
        proxy.init(event);
    }

    @EventHandler
    public void postInit(FMLPostInitializationEvent event) 
    {
        proxy.postInit(event);
    }
}
```
description: Объяснение того, как Forge загружает мод в Minecraft. Названия стадий загрузки и советы по их использованию.

# Стадии загрузки мода

Forge загружает моды в 3 стадии: Преинициализация, Инициализация и Постинициализация или `preInit`, `init`, `postInit`.

Есть и другие стадии, но эти три являются самыми главными. Все они выполняются в разные моменты загрузки мода и предназначены для
разных целей.

## Использование стадий

Все стадии загрузки мода могут использоваться **только** в главном файле мода! То есть в файле с аннотацией `@Mod`. Стадии
загрузки можно использовать при помощи аннотации `@EventHandler`.

### Преинициализация

Стадия преинициализации используется для того, чтобы дать игре знать о том, что есть в вашем моде: блоках, предметах и так далее.

Чаще всего в этой стадии выполняются следующие действия:

* Регистрация блоков и предметов.
* Регистрация Tile Entity
* Регистрация сущностей
* Присвоение имен в Ore Dictionary

Событие этой стадии: `FMLPreInitializationEvent`. В главном файле его использование выглядит следующим образом:

```java
// TestMod.java

@EventHandler
public void preInit(FMLPreInitializationEvent event) {
    // Преинициализация
    System.out.println("\u001B[32m" + "[Starting Test Mod PRE-INITIALIZATION]" + "\u001B[0m");
}
```

### Инициализация

Стадия инициализации предназначена для выполнения действий с объектами, зарегистрированными в преинициализации.

Чаще всего в этой стадии выполняются следующие действия:

* Регистрация генераторов структур
* Регистрация рецептов
* Регистрация обработчиков действий

Событие этой стадии: `FMLInitializationEvent`. В главном файле его использование выглядит следующим образом:

```java
// TestMod.java

@EventHandler
public void init(FMLInitializationEvent event) {
    // Инициализация
    System.out.println("\u001B[32m" + "[Starting Test Mod INITIALIZATION]" + "\u001B[0m");
}
```

### Постинициализация

На стадии постинициализации рекомендуется выполнять действия, связанные с другими модами.

Событие этой стадии: `FMLPostInitializationEvent`. В главном файле его использование выглядит следующим образом:

```java
// TestMod.java

@EventHandler
public void postInit(FMLPostInitializationEvent event) {
    // Инициализация
    System.out.println("\u001B[32m" + "[Starting Test Mod POST-INITIALIZATION]" + "\u001B[0m");
}
```

## Итог

Учитывая 3 основные стадии загрузки Forge мода, наш главный файл мода должен выглядит приблизительно так:

```java
package ru.ivasik.tutorial;

import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.Mod.EventHandler;
import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPostInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;

@Mod(modid = "tut")
public class Tutorial
{
    @EventHandler
    public void preInit(FMLPreInitializationEvent event)
    {
        // Преинициализация
        System.out.println("\u001B[32m" + "[Starting Test Mod PRE-INITIALIZATION]" + "\u001B[0m");
    }

    @EventHandler
    public void init(FMLInitializationEvent event)
    {
        // Инициализация
        System.out.println("\u001B[32m" + "[Starting Test Mod INITIALIZATION]" + "\u001B[0m");
    }

    @EventHandler
    public void postInit(FMLPostInitializationEvent event)
    {
        // Инициализация
        System.out.println("\u001B[32m" + "[Starting Test Mod POST-INITIALIZATION]" + "\u001B[0m");
    }
}
```

Если вы запустите клиент с этим кодом загрузки стадий, то в консоли увидите следующее:

![Демонстрация стадий загрузки](images/loading_stages.png){: .border }

Можно отчетливо видеть, что эти стадии выполняются в разное время.

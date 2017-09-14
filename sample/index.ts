import { JsonName, JsonStruct, JsonMeta, serialize, deserialize } from './../index';
import 'reflect-metadata';

const data = {
    products: {
        Astral: {
            read: true,
            write: false
        },
        QES: {
            pay: false,
            withdraw: true
        }
    }
};

class Astral {
    @JsonName()
    read: boolean = false;

    @JsonName()
    write: boolean = false;
}

class QES {
    @JsonName()
    pay: boolean = false;

    @JsonName()
    withdraw: boolean = false;

    static fromServer(data: any): QES {
        return deserialize(data, QES);
    }
}

class VED {
    @JsonName()
    dollar: boolean = false;
}

class Permissions {
    @JsonStruct()
    Astral: Astral = null;

    @JsonStruct()
    QES: QES = new QES();

    @JsonStruct()
    VED: VED = new VED();

    static fromServer(data: object): Permissions {
        return deserialize(data, Permissions);
    }
}

console.log(Permissions.fromServer(data));
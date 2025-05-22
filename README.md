# Firewire

Firewire 2: Electric Boogaloo

# Installation Instructions

Follow the below to start the application correctly.

## Pre-requisites

> Node.js
> Python 3.12

## Install dependencies

### Frontend

```
cd frontend/
npm install
```

### Backend

```
cd backend/
python3 -m venv .venv
pip install --upgrade pip
pip install -r requirements.txt
```

### Terminal 1 - Start Flask

```
cd backend
. .venv/bin/activate
python App.py
```

### Terminal 2 - Start Vite

```
cd frontend
npm install
npm run dev
```

### Testing - Run individual Python files

From the root folder, you can run:

```
python -m backend.modules.subdir.subdir.filename
```

OR

```
python -m backend.modules.tests.Test
```

# Appendix

Pulls from locally saved CSVs.

## Lifetime of Pandas Tables

Duration of the python script run. Consider using the following formats to save parsing:

### Pickle

Preserves pandas objects and data types.

```
# Store as pickle file
df_etf.to_pickle('data.pkl')

# Later, load it back:
df = pd.read_pickle('data.pkl')
```

- [More info](https://www.datacamp.com/tutorial/pickle-python-tutorial).

### SQLAlchemy

Object-relational Mapper (ORM) Database which preserves object mapping.

```
from sqlalchemy import create_engine
engine = create_engine('sqlite:///database.db')
df_etf.to_sql('table_name', engine)
```

- [More info](https://docs.sqlalchemy.org/en/14/orm/tutorial.html).

## Data Encountered

Empty, --, Nan

import json
import sys
import rdflib
from rdflib.term import URIRef, Variable
import os

g=rdflib.Graph()

cwd = os.getcwd()


g.parse(cwd+'/ontology/CREWW_Ontology_v9.rdf', format='application/rdf+xml')


def queryRDF():
    json_obj = open(sys.argv[2])
    data = json.load(json_obj)
    queryString = data["queryString"]

    results = g.query(queryString)

    uris = [str(list(binding.values())[0]).split("#")[-1] for binding in results.bindings]


    json_object_result = json.dumps(uris, indent=4)
    with open(sys.argv[3], "w") as outfile:
        outfile.write(json_object_result)
    print("OK")


if sys.argv[1] == 'queryRDF':
    queryRDF()

sys.stdout.flush()